//Auth token we will use to generate a meeting and connect to it
export const authToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmYjA1MmVlZC05ODQyLTRiMDgtYTE2Ny0wYWVjNTRmNTQxZjkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5NTk2Mjg5NywiZXhwIjoxNjk2MDQ5Mjk3fQ.JIdA8PCj3A2wbajx5DPIUog1xWC8341QfH-ksgj-fFo";

// API call to create meeting
export const createMeeting = async ({ token }: { token: string }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId }: { roomId: string } = await res.json();
  return roomId;
};