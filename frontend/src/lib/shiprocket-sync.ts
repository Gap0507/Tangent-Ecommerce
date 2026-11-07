import connectToDB from "@/lib/db";
import { Order, OrderStatus, ShipmentStatus } from "@/models/Order";
import { Settings } from "@/models/Settings";
import { getShiprocketToken } from "@/lib/shiprocket";

export async function syncOrderWithShiprocket(order: any): Promise<{
  orderStatus: string;
  shipmentStatus: string;
  changed: boolean;
  liveStatus: string;
}> {
  if (!order || !order.awbCode) {
    return {
      orderStatus: order?.orderStatus || OrderStatus.NEW,
      shipmentStatus: order?.shipmentStatus || ShipmentStatus.NOT_CREATED,
      changed: false,
      liveStatus: "NO_AWB",
    };
  }

  try {
    const settings = await Settings.findOne();
    const shiprocketEmail = settings?.shiprocketEmail || process.env.SHIPROCKET_EMAIL;
    const shiprocketApiKey = settings?.shiprocketApiKey || process.env.SHIPROCKET_PASSWORD;

    if (!shiprocketEmail || !shiprocketApiKey) {
      return {
        orderStatus: order.orderStatus,
        shipmentStatus: order.shipmentStatus,
        changed: false,
        liveStatus: "NO_CREDENTIALS",
      };
    }

    const token = await getShiprocketToken(shiprocketEmail, shiprocketApiKey);
    if (!token) {
      return {
        orderStatus: order.orderStatus,
        shipmentStatus: order.shipmentStatus,
        changed: false,
        liveStatus: "AUTH_FAILED",
      };
    }

    const trackRes = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${order.awbCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const trackData = await trackRes.json();
    const trackInfo = trackData?.tracking_data?.shipment_track?.[0] || trackData?.tracking_data;
    const currentStatus = (trackInfo?.current_status || trackInfo?.status || "").toUpperCase();
    const activities = trackData?.tracking_data?.shipment_track_activities || [];
    const latestActivity = (activities[0]?.activity || activities[0]?.status || "").toUpperCase();

    const effectiveStatus = currentStatus || latestActivity;

    let newOrderStatus = order.orderStatus;
    let newShipmentStatus = order.shipmentStatus;

    if (
      effectiveStatus.includes("CANCEL") ||
      currentStatus.includes("CANCEL") ||
      latestActivity.includes("CANCEL")
    ) {
      newOrderStatus = OrderStatus.CANCELLED;
      newShipmentStatus = ShipmentStatus.NOT_CREATED;
    } else if (
      effectiveStatus.includes("DELIVERED") ||
      currentStatus.includes("DELIVERED")
    ) {
      newOrderStatus = OrderStatus.DELIVERED;
      newShipmentStatus = ShipmentStatus.DELIVERED;
    } else if (
      effectiveStatus.includes("TRANSIT") ||
      effectiveStatus.includes("OUT FOR DELIVERY") ||
      effectiveStatus.includes("REACHED AT DESTINATION")
    ) {
      newOrderStatus = OrderStatus.SHIPPED;
      newShipmentStatus = ShipmentStatus.IN_TRANSIT;
    } else if (
      effectiveStatus.includes("PICKED UP") ||
      effectiveStatus.includes("PICKEDUP") ||
      effectiveStatus.includes("MANIFEST")
    ) {
      newOrderStatus = OrderStatus.SHIPPED;
      newShipmentStatus = ShipmentStatus.PICKED_UP;
    }

    if (newOrderStatus !== order.orderStatus || newShipmentStatus !== order.shipmentStatus) {
      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            orderStatus: newOrderStatus,
            shipmentStatus: newShipmentStatus,
          },
        }
      );
      return {
        orderStatus: newOrderStatus,
        shipmentStatus: newShipmentStatus,
        changed: true,
        liveStatus: effectiveStatus || "UPDATED",
      };
    }

    return {
      orderStatus: order.orderStatus,
      shipmentStatus: order.shipmentStatus,
      changed: false,
      liveStatus: effectiveStatus || "UNCHANGED",
    };
  } catch (err: any) {
    console.error("Live Shiprocket sync error for order:", order.orderNumber, err);
    return {
      orderStatus: order.orderStatus,
      shipmentStatus: order.shipmentStatus,
      changed: false,
      liveStatus: "ERROR",
    };
  }
}

