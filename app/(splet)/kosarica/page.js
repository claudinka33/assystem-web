import Kosarica from "./Kosarica";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = { title: "Košarica", robots: { index: false } };

function Stran() {
  return (
    <section className="trg ksb">
      <div className="ksb-w">
        <Kosarica />
      </div>
    </section>
  );
}

export default prevedenaStran(Stran);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
