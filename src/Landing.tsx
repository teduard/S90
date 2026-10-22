import RelatedProducts from "./components/RelatedProducts";
import LandingPageLayout from './layouts/LandingPageLayout';
import { HeroHeader } from "./components/HeroHeader";
import CountdownTimer from "./components/CountdownTimer";
import "./Landing.css";

function Landing() {
  return (
    <>
      <div className="center"><CountdownTimer /></div>
    </>
  )
}

export default Landing