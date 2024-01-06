import { createClient } from "@supabase/supabase-js";
import { postData } from "../services/common/postData";

export interface INotifData {
  title: string;
  senderId: string;
  receiverId: string;
  refId?: string;
}

export const supaNotif = (data: any) => {
  // SUPABASE INTEGRATION
  // SEND MESSAGE TO UPDATE NOTIFICATIONS
  const clientB = createClient(
    "https://oqcxpijzaddmvyzlslam.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xY3hwaWp6YWRkbXZ5emxzbGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ0MDMyMDgsImV4cCI6MjAwOTk3OTIwOH0.AwrfE3NvI5pA46ThsDQ0BN7atamyPQmm_Kk8P7Usl48"
  );
  const channelB = clientB.channel("room-1");
  channelB.subscribe((status: any) => {
    if (status === "SUBSCRIBED") {
      channelB.send({
        type: "broadcast",
        event: "test",
        payload: {
          message: data,
        },
      });
    }
  });
  // END SUPABASE INTEGRATION
};

export const launchNotif = async (
  notifData: INotifData = { title: '', senderId: '', receiverId: '' } ,
  createInDB: boolean = true,
  data: any  = "UPDATE NOTIFICATIONS"
) => {
    
    if(!createInDB){
        supaNotif(data)
        return;
    }

    const { title, senderId, receiverId } = notifData;
    const requestCreate = await postData("api/notifications", {
      title,
      senderId,
      receiverId,
      refId: notifData.refId ? notifData.refId : "",
    });

    if (requestCreate.status) {
        supaNotif(data)
    }
};
