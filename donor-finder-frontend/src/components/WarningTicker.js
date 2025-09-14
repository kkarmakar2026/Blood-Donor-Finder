import React from "react";

export default function WarningTicker() {
  return (
    <div className="w-full overflow-hidden bg-yellow-100 border border-yellow-300 text-yellow-800 font-bold whitespace-nowrap">
      <p className="inline-block animate-marquee px-4">
        ⚠️ <span className="text-red-600">Important Warning:</span> Do not pay any money to individuals or groups claiming to arrange blood donors or provide blood packets.
        If you come across such incidents, immediately report them to LifeConnectSupport Team.
        We have received reports of fraudulent middlemen demanding money. LifeConnect has no agents, does not arrange blood/donors, and never collects money for any service.
      </p>
    </div>
  );
}
