import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import P from "./_sections/powerful-computers";
import Gaming from "./_sections/gaming";
import { Phone } from "lucide-react";
import { Send } from "lucide-react";
import Budget from "./_sections/budget-computers";
import Footer from "./_components/footer";
import HelpCard from "./_components/help-card";

export default function Home() {
  return (
    <main>
      <section className="bg-primary-var text-primary-foreground my-0 py-12">
        <Container as="div">
          <h1 className="header text-4xl pb-6">
            Discover the Future of Laptops: Power, Performance, and Portability
          </h1>
          <div className="flex gap-12">
            <div>
              <p className="text-primary-lig">
                Experience cutting-edge technology with our latest laptops.
                Whether you&apos;re a student, a professional, or a gamer, we
                have the perfect device for you. Our laptops combine
                performance, style, and portability to meet all your computing
                needs.
              </p>
              <Button variant="secondary" className="mt-6">
                <Link href="/products">Explore Computers</Link>
              </Button>
            </div>

            <div className="justify-self-end basis-[900px] grow hidden md:block">
              <Image
                src={"/hero.png"}
                width={200}
                height={200}
                alt="hero-image"
              />
            </div>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <h2 className="text-lg">
            For decades, we have been dedicated to serving our customers with
            high-quality laptops. Our products are sourced from multiple
            countries to ensure that you always find exactly what you need on
            our shelves.
          </h2>
          <div className="flex justify-between flex-wrap mt-4 gap-8">
            <div className="basis-72">
              <div className="flex items-center gap-4">
                <div className=" flex items-center justify-center w-10 h-10 rounded-full  bg-secondary/40">
                  <Check className="text-primary icon-lg" />
                </div>
                <h3 className="sub-header">Origional</h3>
              </div>
              <p className="ml-14">
                We exclusively import original products and are committed to
                maintaining high standards. Rest assured, we do not sell any
                inferior quality items, ensuring that you receive only the best.{" "}
              </p>
            </div>
            <div className="basis-72">
              <div className="flex items-center gap-4">
                <div className=" flex items-center justify-center w-10 h-10 rounded-full  bg-secondary/40">
                  <Check className="text-primary icon-lg" />
                </div>
                <h3 className="sub-header">Guarantee</h3>
              </div>
              <p className="ml-14">
                offering a minimum one-year guarantee on all laptops. This
                commitment ensures that you can shop with confidence, knowing we
                stand behind what we sell.
              </p>
            </div>
            <div className="basis-72">
              <div className="flex items-center gap-4">
                <div className=" flex items-center justify-center w-10 h-10 rounded-full  bg-secondary/40">
                  <Check className="text-primary icon-lg" />
                </div>
                <h3 className="sub-header">Services</h3>
              </div>
              <p className="ml-14">
                we also offer a wide range of accessories and maintenance
                services, ensuring that your experience with us is seamless and
                satisfying.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <P />
      <Gaming />
      <section>
        <Container>
          <HelpCard />
        </Container>
      </section>
      <Budget />
    </main>
  );
}
