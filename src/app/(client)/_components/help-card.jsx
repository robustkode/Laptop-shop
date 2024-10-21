import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Phone } from "lucide-react";
import Link from "next/link";
import React, { memo } from "react";

function HelpCard() {
  return (
    <div className="bg-secondary rounded-sm text-primary-drk text-center p-6 flex flex-col gap-6">
      <h3 className="header text-2xl">Need Help Choosing Your Ideal Laptop?</h3>
      <p>
        Whether you&apos;re looking for performance, portability, or
        budget-friendly options, our team is ready to help you find the perfect
        match. Contact us today !
      </p>
      <div className="flex justify-center sm:gap-12 flex-wrap gap-4">
        <Button>
          <Phone className="icon-lg mr-4" /> <p>0921212121</p>
        </Button>
        <Button variant="outline" className="bg-transparent border-primary">
          <Link
            href={"t.me/my-computer"}
            className="flex items-center  gap-2 text-primary"
          >
            <Send className="icon-lg text-primary" />
            Telegram
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default memo(HelpCard);
