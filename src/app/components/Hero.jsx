import React, { useEffect, useRef, useState } from "react";

import Saldacao from "./Saldacao";

import Footer from "./Footer";



export default function Hero() {
  return (
    <div className="flex-grow flex flex-col overflow-hidden relative">
      <Saldacao />

      

      <Footer />
    </div>
  );
}
