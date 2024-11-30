import { useSsProgram } from "../data-access/ss-data-access";

export default function HomeFeature() {
  const { partiesAccounts } = useSsProgram();

  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <div className="max-w-5xl">
            <div className="text-left">
              <h1 className="text-5xl font-bold mb-6">What is Secret Santa?</h1>
              <p className="py-4">
                Secret Santa is a fun and free online tool for organizing gift exchanges. Whether you're planning a
                holiday celebration with friends, family, or coworkers, our platform makes it simple and exciting to set
                up your Secret Santa event.
              </p>
              <p className="py-6">
                Every year during the holiday season, people around the world exchange gifts. Secret Santa adds a
                playful twist by randomly assigning participants a gift recipient, keeping the process mysterious and
                full of surprises!
              </p>
              <h1 className="text-3xl font-bold">How Does It Work?</h1>
              <p className="py-4">
                <ul>
                  <li className="py-1">
                    <b>Create Your Party</b>: Start by creating a Secret Santa party on our homepage.
                  </li>
                  <li className="py-1">
                    <b>Add Participants</b>: Invite between 3 and 50 people to join the fun.
                  </li>
                  <li className="py-1">
                    <b>Randomize Gift Pairings</b>: Let our system assign each participant their gift recipient.
                  </li>
                  <li className="py-1">
                    <b>Share Links</b>: Generate personalized links for each participant, so they can privately discover
                    who they’ll be gifting to.
                  </li>
                </ul>
              </p>
              <p className="py-3">
                Organizing a holiday gift exchange has never been easier or more fun! Get started today and make your
                celebrations unforgettable.
              </p>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
      <div>{partiesAccounts.data?.length ? "ADD ACCOUNT" : "INITIALIZE ACCOUNTS"}</div>
      {console.log("Parties accounts>>>", partiesAccounts)}
    </>
  );
}
