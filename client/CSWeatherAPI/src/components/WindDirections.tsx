import { ArrowDown, ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpLeft, ArrowUpRight, Compass } from "@animateicons/react/lucide";

const WindDirections = ({ degrees }: {degrees: number}) => {
  
  switch (true) {
    case (degrees >= 337.5 && degrees <= 22.5):
      return <div className="flex flex-row"><ArrowUp className="w-6 h-6 text-purple-400/80"/>N</div>;

    case (degrees >= 22.6 && degrees <= 67.5):
      return <div className="flex flex-row"><ArrowUpRight className="w-6 h-6 text-purple-400/80"/>NW</div>;

    case (degrees >= 67.6 && degrees <= 112.5):
      return <div className="flex flex-row"><ArrowRight className="w-6 h-6 text-purple-400/80"/>W</div>;

    case (degrees >= 112.6 && degrees <=157.5):
      return <div className="flex flex-row"><ArrowDownRight className="w-6 h-6 text-purple-400/80"/>SW</div>;

    case (degrees >= 157.6 && degrees <= 202.5):
      return <div className="flex flex-row"><ArrowDown className="w-6 h-6 text-purple-400/80"/>S</div>;

    case (degrees >= 202.6 && degrees <= 247.5):
      return <div className="flex flex-row"><ArrowDownLeft className="w-6 h-6 text-purple-400/80"/>SE</div>;

    case (degrees >= 247.6 && degrees <= 292.5):
      return <div className="flex flex-row"><ArrowLeft className="w-6 h-6 text-purple-400/80"/><div>E</div></div>;

    case (degrees >= 292.6 && degrees <=337.5):
      return <div className="flex flex-row"><ArrowUpLeft className="w-6 h-6 text-purple-400/80"/>NE</div>;

    default:
      return <Compass className="w-6 h-6 text-blue-600"/>
  }
};

export default WindDirections;