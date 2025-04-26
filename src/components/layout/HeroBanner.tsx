export function HeroBanner() {
  return (
    <div className="hero-banner w-full h-[600px] bg-[#212327] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      <img 
        src="https://steaminventory.ru/background.png" 
        alt="Gaming Heroes Banner"
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 25%' }}
      />
    </div>
  );
}