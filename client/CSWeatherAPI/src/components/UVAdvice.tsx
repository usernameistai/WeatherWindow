import { OctagonAlertIcon, TriangleAlertIcon } from "@animateicons/react/lucide";
import { FaceAngry, FaceExpressionless, FaceGrinning } from "lucide-react";

interface UVAdviceProps {
  uvi: number | undefined;
};

const UVAdvice = ({ uvi }: UVAdviceProps) => {
  if ( uvi === undefined) return "";
  switch (true) {
    case uvi < 2:
      return (
        <span className="flex items-center gap-2">
          <FaceGrinning size={64} className="text-yellow-300 drop-shadow-[0_2px_4px_rgba(253,224,71,0.5)]"/>
          LOW - Safe to be outside, caution =&gt; sunblock
        </span>
      );
    case uvi < 5:
      return (
        <span className="flex items-center gap-2">
          <FaceExpressionless size={64} className="text-yellow-600 drop-shadow-[0_2px_4px_rgba(202,138,4,0.5)]"/>
          MODERATE - Sun Protection - (SPF 30+) & Sunglasses
        </span>
      );
    case uvi < 7:
      return (
        <span className="flex items-center gap-2">
          <FaceAngry size={64} className="text-orange-500 drop-shadow-[0_2px_4px_rgba(249,115,22,0.5)]"/>
          HIGH - SPF 30+, Wide-brimmed Hat & UV Sunglasses
        </span>
      );
    case uvi < 10:
      return (
        <span className="flex items-center gap-2">
          <TriangleAlertIcon size={32} className="text-orange-700 drop-shadow-[0_2px_4px_rgba(194,65,12,0.5)]"/>
          VERY HIGH - Must be covered up, head-to-toe
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-2">
          <OctagonAlertIcon size={32} className="text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.5)]"/>
          EXTREME - Remain indoors during peak sunshine hours please
        </span>
      );
  };
};

export default UVAdvice;