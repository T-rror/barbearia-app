import React, { useEffect, useRef, useState } from "react";

import Saldacao from "./Saldacao";





export default function Hero() {
  return (
    <div className="flex-grow flex flex-col overflow-hidden relative">
      <Saldacao />
    </div>
  );
}
