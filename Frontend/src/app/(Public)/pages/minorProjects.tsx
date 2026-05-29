"use client";
import { useRef, useState, useEffect } from "react";
import "../../../../public/assets/style/Caro.scss";
import { minorProjectInfo } from "../../../services/projectService";
import RemoteImage from "../components/ui/RemoteImage";

interface CardProps {
  dataImage: string;
  header: string;
  link: string;
}

const Card = ({ dataImage, header, link }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (cardRef.current) {
      setWidth(cardRef.current.offsetWidth);
      setHeight(cardRef.current.offsetHeight);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setMouseX(e.clientX - rect.left - width / 2);
      setMouseY(e.clientY - rect.top - height / 2);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setMouseX(0);
      setMouseY(0);
    }, 300);
  };

  const cardStyle = {
    transform: `rotateY(${(mouseX / width) * 20}deg) rotateX(${(-mouseY / height) * 20}deg)`,
    transition: "transform 0.3s ease-out",
  };

  const cardBgTransform = {
    transform: `translateX(${(mouseX / width) * -10}px) translateY(${(mouseY / height) * -10}px)`,
    transition: "transform 0.2s ease-out",
  };

  return (
    <div
      className="card-wrap"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="card" style={cardStyle}>
          <div className="card-bg borders" style={cardBgTransform}>
            <RemoteImage src={dataImage} alt={header} fill className="object-cover" />
          </div>
        </div>
        <div className="text-center text-lg text-gray-900 dark:text-gray-100 font-mono font-semibold mt-6">
          <h1>{header}</h1>
        </div>
      </a> 
    </div>
  );
};

const MinorProjectSection = ({ data }: { data: minorProjectInfo[] }) => {
  const projects = data;
  const carouselRef = useRef<HTMLDivElement>(null);

  if (projects.length === 0) {
    return null;
  }
  



  const scrollToLast = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <h1 className="mt-12 text-center font-bold mb-8 relative text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100">
        Project <span className="text-pink-500">Section</span>
        <div className="absolute w-20 h-1 bg-pink-500 left-1/2 -translate-x-1/2 bottom-[-12px]"></div>
      </h1>

      <section style={{ maxWidth: "100%" }}>
        <div className="z-30 px-0 pt-0 pb-0 lg:px-0 xl:px-0">
          <div className="flex">
            <div className="carousel ml-6" ref={carouselRef}>
              {projects.map((project) => (
                <Card
                  key={project.id}
                  dataImage={project.image}
                  header={project.header}
                  link={project.html_url}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MinorProjectSection;
