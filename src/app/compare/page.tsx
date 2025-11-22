"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientDiamond } from "@/types/client/diamond";
import { clientDiamondAPI } from "@/services/client-api";


import { X, ArrowLeft } from "lucide-react";

const diamondFields = [
  { label: "Packet No", key: "packetNo" },
  { label: "Location", key: "location" },
  { label: "Report No", key: "certificateNumber" },
  { label: "Lab", key: "laboratory" },
  { label: "Shape", key: "shape" },
  { label: "Wgt", key: "size" },
  { label: "Col", key: "color" },
  { label: "Clarity", key: "clarity" },
  { label: "Cut", key: "cut" },
  { label: "Pol", key: "polish" },
  { label: "Sym", key: "symmetry" },
  { label: "Fls", key: "fluorescenceIntensity" },
  { label: "Rap.($)", key: "rapList" },
  { label: "Length", key: "length" },
  { label: "Width", key: "width" },
  { label: "Depth", key: "depth" },
  { label: "Depth %", key: "totalDepth" },
  { label: "Table %", key: "table" },
  { label: "Disc %", key: "discount" },
  { label: "Net Rate", key: "pricePerCarat" },
  { label: "Net Value", key: "price" },
  { label: "C/A", key: "crownAngle" },
  { label: "C/H", key: "crownHeight" },
  { label: "P/A", key: "pavilionAngle" },
  { label: "P/H", key: "pavilionHeight" },
  { label: "Ratio", key: "ratio" },
  { label: "Girdle", key: "girdle" },
  { label: "Girdle %", key: "girdlePercent" },
  { label: "Star", key: "star" },
  { label: "Key To Symbols", key: "keyToSymbols" },
  { label: "Report Comments", key: "reportComments" },
  { label: "Comments 1", key: "comments1" },
  { label: "Brl.", key: "brilliance" },
  { label: "Heart & Arrow", key: "heartArrow" },
  { label: "Inscription", key: "inscription" },
  { label: "Black Size 1", key: "blackSize1" },
  { label: "Black Size 2", key: "blackSize2" },
  { label: "Feather Size 1", key: "featherSize1" },
  { label: "Feather Size 2", key: "featherSize2" },
  { label: "Open Pos 4", key: "openPos4" },
  { label: "EC", key: "ec" },
  { label: "Shade", key: "shade" },
  { label: "Type2 Cert", key: "type2Cert" },
  { label: "Block Type Seq", key: "blockTypeSeq" },
];

const getDiamondFieldValue = (diamond: any, key: string) => {
  // Handle nested fields
  if (key === "length" || key === "width" || key === "depth") {
    return diamond.measurements?.[key] ?? "-";
  }
  // Handle ratio calculation
  if (key === "ratio") {
    const length = diamond.measurements?.length;
    const width = diamond.measurements?.width;
    return length && width ? (length / width).toFixed(2) : "-";
  }
  // Format currency fields
  if (["rapList", "pricePerCarat", "price"].includes(key)) {
    const value = diamond[key];
    return value ? `$${new Intl.NumberFormat("en-US").format(value)}` : "-";
  }
  // Format percentage fields
  if (["discount"].includes(key)) {
    const value = diamond[key];
    return value ? `${value}%` : "-";
  }
  return diamond[key] !== undefined && diamond[key] !== null && diamond[key] !== ""
    ? diamond[key]
    : "-";
};

const getShapeImage = (shapeValue: string) => {
  const shapeMap: { [key: string]: string } = {
    Round: "round.svg",
    Emerald: "emerald.svg",
    Princess: "princess.svg",
    Asscher: "asscher.svg",
    Cushion: "cushion.svg",
    "Cushion Modified": "cushion.svg",
    "Cushion Brilliant": "cushion.svg",
    Oval: "oval.svg",
    Heart: "heart.svg",
    Marquise: "marquise.svg",
    Baguette: "baguette.svg",
    "Tapered Baguette": "tapered.svg",
    Radiant: "radiant.svg",
    Pear: "pear.svg",
    Square: "square.svg",
    "Square Emerald": "sqEmerald.svg",
    Trilliant: "trilliant.svg",
  };
  const fileName = shapeMap[shapeValue];
  return fileName
    ? `/assets/diamondShapes/${fileName}`
    : `/assets/diamondShapes/others.png`;
};

const ComparePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",") : [];
  const [diamonds, setDiamonds] = useState<ClientDiamond[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length > 0) {
      setLoading(true);
      clientDiamondAPI.getAllDiamonds().then((allDiamonds: ClientDiamond[]) => {
        const filtered = allDiamonds.filter((d) => ids.includes(d._id));
        setDiamonds(filtered);
        setLoading(false);
      });
    } else {
      setDiamonds([]);
      setLoading(false);
    }
  }, [idsParam]);

  const diamondTablePath = "/inventory";
  const handleRemoveDiamond = (id: string) => {
    const newIds = ids.filter((diamondId) => diamondId !== id);
    if (newIds.length < 2) {
      router.push(diamondTablePath);
    } else {
      router.push(`/compare?ids=${newIds.join(",")}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (diamonds.length < 2) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-black mb-4">Select at least two diamonds to compare.</p>
          <button
            onClick={() => router.push(diamondTablePath)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-200 hover:text-black"
          >
            Back to Diamond List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header (removed Back to List button from here) */}
        <div className="mb-6"></div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border border-black border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="sticky left-0 z-20 bg-white text-black px-6 py-4 text-left font-semibold min-w-[180px] border border-black">
                    <div className="flex flex-col items-start gap-1 justify-start" style={{ minHeight: '70px' }}>
                      <button
                        onClick={() => router.push(diamondTablePath)}
                        className="flex items-center gap-1 px-2 py-1 bg-white text-black rounded-md hover:bg-gray-200 transition-colors border border-black mb-4 text-xs"
                        style={{ fontSize: '0.75rem', lineHeight: '1rem', marginTop: '-36px' }}
                      >
                        <ArrowLeft className="w-3 h-3 text-black" />
                        Back to List
                      </button>
                      <span>Stage</span>
                    </div>
                  </th>
                  {diamonds.map((diamond, idx) => (
                    <th
                      key={diamond._id}
                      className="bg-white text-black px-6 py-4 min-w-[220px] border border-black"
                    >
                      <div className="flex flex-col items-center gap-3">
                        {/* Diamond Image */}
                        <div className="relative w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={getShapeImage(diamond.shape || "Round")}
                            alt={diamond.shape || "Diamond"}
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/diamondShapes/others.png";
                            }}
                          />
                        </div>
                        {/* Diamond Label removed */}
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveDiamond(diamond._id)}
                          className="text-black hover:text-red-400 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diamondFields.map((field, fieldIdx) => (
                  <tr
                    key={field.key}
                    className="bg-white"
                  >
                    <td className="sticky left-0 z-10 px-6 py-3 font-semibold text-black border border-black bg-white">
                      {field.label}
                    </td>
                    {diamonds.map((diamond) => (
                      <td
                        key={diamond._id}
                        className="px-6 py-3 text-center text-black border border-black bg-white"
                      >
                        {getDiamondFieldValue(diamond, field.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComparePage;
