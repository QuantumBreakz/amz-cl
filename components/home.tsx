"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products, productUrl, searchUrl, categories, productById } from "@/lib/catalog";
import artwork from "@/lib/reference-assets.json";
import { ProductCard } from "./ui";
import { useStore } from "./store";
const fallbackImage = "/assets/categories-3.jpg";
function fromCatalog(id: string) { return productById(id)?.images[0] || fallbackImage; }
const patchedArtwork: Record<string, string> = {
  ...artwork,
  Fuji_SingleImageCard_BTS_SH26: fromCatalog("ref-58"),
  Fuji_Gaming_SingleImageCard_C: fromCatalog("ref-76"),
  DQC_APR_TBYB_W_BOTTOMS: fromCatalog("15"),
  DQC_APR_TBYB_W_TOPS: fromCatalog("13"),
  DQC_APR_TBYB_W_DRESSES: fromCatalog("18"),
  DQC_APR_TBYB_W_SHOES: fromCatalog("ref-32"),
  Fuji_QuadCard_Bag: fromCatalog("ref-58"),
  Fuji_QuadCard_Electronics: fromCatalog("ref-55"),
  Fuji_QuadCard_Stationery: fromCatalog("ref-60"),
  Fuji_QuadCard_Fashion: fromCatalog("ref-23"),
  "313wAT6Iy2L": fromCatalog("ref-21"),
  "21W7-lndINL": fromCatalog("ref-17"),
  "21B-NkA9p-L": fromCatalog("ref-11"),
  "217GQ1a2QzL": fromCatalog("ref-20"),
  CARD_Tech_1: fromCatalog("2"),
  CARD_Tech_2: fromCatalog("ref-80"),
  CARD_Tech_3: fromCatalog("ref-79"),
  CARD_Tech_4: fromCatalog("6"),
  CARD_Fit_1: fromCatalog("ref-2"),
  CARD_Fit_2: fromCatalog("ref-1"),
  CARD_Fit_3: fromCatalog("ref-4"),
  CARD_Fit_4: fromCatalog("ref-5"),
  CARD_Travel_1: fromCatalog("ref-58"),
  CARD_Travel_2: fromCatalog("ref-59"),
  CARD_Travel_3: fromCatalog("ref-3"),
  CARD_Travel_4: fromCatalog("ref-5"),
  CARD_PC_1: fromCatalog("ref-54"),
  CARD_PC_2: fromCatalog("ref-55"),
  CARD_PC_3: fromCatalog("ref-56"),
  CARD_PC_4: fromCatalog("ref-57"),
  CARD_Family_1: fromCatalog("ref-34"),
  CARD_Family_2: fromCatalog("ref-35"),
  CARD_Family_3: fromCatalog("ref-36"),
  CARD_Family_4: fromCatalog("ref-37"),
  CARD_HomeEss_1: fromCatalog("ref-66"),
  CARD_HomeEss_2: fromCatalog("ref-67"),
  CARD_HomeEss_3: fromCatalog("ref-68"),
  CARD_HomeEss_4: fromCatalog("ref-69"),
  CARD_Beauty_1: fromCatalog("ref-51"),
  CARD_Beauty_2: fromCatalog("ref-74"),
  CARD_Beauty_3: fromCatalog("ref-75"),
  CARD_Beauty_4: fromCatalog("ref-84"),
  CARD_Deals_1: fromCatalog("1"),
  CARD_Deals_2: fromCatalog("ref-13"),
  CARD_Deals_3: fromCatalog("ref-34"),
  CARD_Deals_4: fromCatalog("ref-40"),
};
export function referenceImage(part: string) { return Object.entries(patchedArtwork).find(([name]) => name.includes(part))?.[1] || fallbackImage; }
export function Rail({title, department, deal = false}: {title: string; department?: string; deal?: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  const list = products.filter(p => (!department || p.category === department) && (!deal || p.isDeal));
  return <section className={`rail-section ${deal ? "deals-rail" : ""}`}><div className="section-heading"><h2>{title}</h2><Link href={deal ? "/deals" : searchUrl("", department)}>See more</Link></div><div className="rail-wrap"><button className="rail-arrow left" aria-label={`Previous ${title}`} onClick={()=>ref.current?.scrollBy({left:-800,behavior:"smooth"})}><ChevronLeft/></button><div className="product-rail" ref={ref}>{list.map(p=>deal ? <ProductCard key={p.id} product={p} deal/> : <Link className="rail-image" key={p.id} href={productUrl(p.id)}><img src={p.images[0]} alt={p.name} loading="lazy"/></Link>)}</div><button className="rail-arrow right" aria-label={`Next ${title}`} onClick={()=>ref.current?.scrollBy({left:800,behavior:"smooth"})}><ChevronRight/></button></div></section>;
}
type Tile = [image:string, label:string, department:string, query?:string];
function Quad({title, items, label="See more", department}: {title:string;items:Tile[];label?:string;department:string}) {
  return <section className="home-card"><h2>{title}</h2><div className="quad-grid">{items.map(([image,label,category,query])=><Link key={label} href={searchUrl(query,category)}><div className="quad-image"><img src={referenceImage(image)} alt={label} loading="lazy"/></div><span>{label}</span></Link>)}</div><Link className="card-more" href={searchUrl("",department)}>{label}</Link></section>;
}
function Single({title,image,department,label}: {title:string;image:string;department:string;label:string}) { return <section className="home-card"><h2>{title}</h2><Link className="single-card-image" href={searchUrl("",department)}><img src={referenceImage(image)} alt={title}/></Link><Link className="card-more" href={searchUrl("",department)}>{label}</Link></section>; }
const slides = [["71ROLBmB4AL", "Shop Back to School", "Office Products"],["71qcoYgEhzL", "Get your game on", "Video Games"],["619geyiQI5L", "Kitchen essentials under $50", "Kitchen & Dining"],["61Yx5-N155L", "Toys for little ones", "Toys & Games"]];
export default function Home() {
 const [slide,setSlide] = useState(0); const store = useStore();
 return <div className="home"><h1 className="sr-only">Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books and more</h1><section className="campaign-hero" aria-label="Featured offers" aria-roledescription="carousel"><Link href={searchUrl("",slides[slide][2])}><img src={referenceImage(slides[slide][0])} alt={slides[slide][1]} fetchPriority="high"/></Link><button className="hero-arrow left" aria-label="Previous promotion" onClick={()=>setSlide((slide+3)%4)}><ChevronLeft size={48} strokeWidth={1.4}/></button><button className="hero-arrow right" aria-label="Next promotion" onClick={()=>setSlide((slide+1)%4)}><ChevronRight size={48} strokeWidth={1.4}/></button><div className="hero-dots">{slides.map((s,i)=><button key={s[0]} aria-label={`Show ${s[1]}`} aria-pressed={i===slide} onClick={()=>setSlide(i)}/>)}</div></section>
 <div className="home-content reference-home"><div className="home-card-grid">
 <div className="promo-rail">
 <Single title="Must-haves for every student" image="Fuji_SingleImageCard_BTS_SH26" department="Office Products" label="Shop Back to School"/>
 <Single title="Get your game on" image="Fuji_Gaming_SingleImageCard_C" department="Video Games" label="Shop gaming"/>
 </div>
 <Quad title="Shop Fashion for less" department="Clothing, Shoes & Jewelry" label="See all deals" items={[["DQC_APR_TBYB_W_BOTTOMS","Jeans under $50","Clothing, Shoes & Jewelry","pants"],["DQC_APR_TBYB_W_TOPS","Tops under $25","Clothing, Shoes & Jewelry","shirt"],["DQC_APR_TBYB_W_DRESSES","Styles under $30","Clothing, Shoes & Jewelry","Women"],["DQC_APR_TBYB_W_SHOES","Shoes under $50","Clothing, Shoes & Jewelry","Shoes"]]}/>
 <Quad title="Must-have school supplies" department="Office Products" label="Shop Back to School" items={[["Fuji_QuadCard_Bag","Backpacks","Luggage & Travel"],["Fuji_QuadCard_Electronics","Electronics","Computers"],["Fuji_QuadCard_Stationery","Stationery","Office Products"],["Fuji_QuadCard_Fashion","Fashion","Clothing, Shoes & Jewelry"]]}/>
 <Quad title="New home arrivals under $50" department="Home & Kitchen" label="Shop the latest from Home" items={[["315_HP_NewArrivals","Kitchen & dining","Kitchen & Dining"],["316_HP_NewArrivals","Home improvement","Tools & Home Improvement"],["317_HP_NewArrivals","Décor","Home & Kitchen","Décor"],["318_HP_NewArrivals","Bedding & bath","Home & Kitchen","Bedding"]]}/>
 <Quad title="Top categories in Kitchen appliances" department="Kitchen & Dining" label="Explore all products in Kitchen" items={[["313wAT6Iy2L","Cookers","Kitchen & Dining","Ninja"],["21W7-lndINL","Coffee","Kitchen & Dining","Coffee"],["21B-NkA9p-L","Pots and pans","Kitchen & Dining","Cookware"],["217GQ1a2QzL","Kitchen tools","Kitchen & Dining","Tools"]]}/>
 <Quad title="Fashion trends you like" department="Clothing, Shoes & Jewelry" label="Explore more" items={[["LSS23_SPRING_DT_CAT_CARD_2","Everyday style","Clothing, Shoes & Jewelry","Women"],["LSS23_SPRING_DT_CAT_CARD_3","Knits","Clothing, Shoes & Jewelry","sweater"],["LSS23_SPRING_DT_CAT_CARD_1","Layers","Clothing, Shoes & Jewelry","hoodie"],["LSS23_SPRING_DT_CAT_CARD_4","Accessories","Clothing, Shoes & Jewelry","socks"]]}/>
 <Quad title="Easy updates for elevated spaces" department="Home & Kitchen" label="Shop home products" items={[["EE_LaundryLuxe","Baskets & hampers","Home & Kitchen","Laundry"],["EE_Kitchen","Hardware","Tools & Home Improvement"],["EE_AccentFurniture","Accent furniture","Home & Kitchen"],["EE_Hallway","Décor & frames","Home & Kitchen","frame"]]}/>
 </div><Rail title="Best Sellers in Sports & Outdoors" department="Sports & Outdoors"/>
 <div className="home-card-grid">
 <Quad title="Wireless Tech" department="Electronics" label="See more" items={[["CARD_Tech_1","Headphones","Electronics","Audio"],["CARD_Tech_2","Smart watches","Electronics","Wearable"],["CARD_Tech_3","Chargers","Electronics","Accessories"],["CARD_Tech_4","Smartphones","Electronics","Smartphones"]]}/>
 <Quad title="Gear up to get fit" department="Sports & Outdoors" label="Shop Sports & Outdoors" items={[["CARD_Fit_1","Strength","Sports & Outdoors","Fitness"],["CARD_Fit_2","Hydration","Sports & Outdoors","Water Bottles"],["CARD_Fit_3","Golf","Sports & Outdoors","Golf"],["CARD_Fit_4","Outdoors","Sports & Outdoors","Camping"]]}/>
 <Quad title="Most-loved travel essentials" department="Luggage & Travel" label="Explore travel" items={[["CARD_Travel_1","Backpacks","Luggage & Travel","Backpacks"],["CARD_Travel_2","Luggage racks","Luggage & Travel","Travel"],["CARD_Travel_3","Water bottles","Sports & Outdoors","Water Bottles"],["CARD_Travel_4","Filters","Sports & Outdoors","Camping"]]}/>
 <Quad title="Level up your PC here" department="Computers" label="Shop Computers" items={[["CARD_PC_1","Tablets","Computers","Tablets"],["CARD_PC_2","Monitors","Computers","Monitors"],["CARD_PC_3","Gaming monitors","Computers","Monitors"],["CARD_PC_4","Networking","Computers","Networking"]]}/>
 </div>
 <Rail title="Popular products in Kitchen internationally" department="Kitchen & Dining"/>
 <section className="department-strip"><h2>Shop by department</h2><div>{categories.map(c=><Link href={searchUrl("",c.name)} key={c.id}><span><img src={c.image} alt="" loading="lazy"/></span><b>{c.name}</b></Link>)}</div></section>
 <Rail title="Deals worth discovering" deal/><Rail title="Best Sellers in Clothing, Shoes & Jewelry" department="Clothing, Shoes & Jewelry"/>
 <div className="home-card-grid lower-cards">{["Toys & Games","Beauty & Personal Care","Computers","Baby"].map(name=><section className="home-card" key={name}><h2>{name === "Baby" ? "Little things. Big adventures." : `Discover ${name}`}</h2><div className="category-products">{products.filter(p=>p.category===name).slice(0,4).map(p=><Link href={productUrl(p.id)} key={p.id}><img src={p.images[0]} alt={p.name} loading="lazy"/></Link>)}</div><Link className="card-more" href={searchUrl("",name)}>Shop now</Link></section>)}</div>
 <Rail title="Best Sellers in Home & Kitchen" department="Home & Kitchen"/>
 <div className="home-card-grid">
 <Quad title="Have more fun with family" department="Toys & Games" label="Shop Toys & Games" items={[["CARD_Family_1","Plush toys","Toys & Games","Stuffed"],["CARD_Family_2","Ride-ons","Toys & Games","Outdoor Play"],["CARD_Family_3","Playsets","Toys & Games","Vehicles"],["CARD_Family_4","Giant plush","Toys & Games","Stuffed"]]}/>
 <Quad title="Shop for your home essentials" department="Home & Kitchen" label="Shop Home & Kitchen" items={[["CARD_HomeEss_1","Air quality","Home & Kitchen","Air Quality"],["CARD_HomeEss_2","Bath","Home & Kitchen","Bath"],["CARD_HomeEss_3","Bedding","Home & Kitchen","Bedding"],["CARD_HomeEss_4","Décor","Home & Kitchen","Décor"]]}/>
 <Quad title="Level up your beauty routine" department="Beauty & Personal Care" label="Shop Beauty" items={[["CARD_Beauty_1","Personal care","Beauty & Personal Care"],["CARD_Beauty_2","Cleaning","Health & Household","Household"],["CARD_Beauty_3","Home comfort","Health & Household","Home Environment"],["CARD_Beauty_4","Wipes","Health & Household","Household"]]}/>
 <Quad title="Deals on top categories" department="Electronics" label="See all deals" items={[["CARD_Deals_1","Electronics","Electronics","Audio"],["CARD_Deals_2","Kitchen","Kitchen & Dining"],["CARD_Deals_3","Toys","Toys & Games"],["CARD_Deals_4","Baby","Baby"]]}/>
 </div>
 <Rail title="Level up your everyday tech" department="Electronics"/></div>
 <section className="personalized"><h2>{store.name ? `Discover more, ${store.name}` : "See personalized recommendations"}</h2><Link className="yellow-button" href={store.name ? "/deals" : "/ap/signin"}>{store.name ? "Explore deals" : "Sign in"}</Link>{!store.name && <p>New customer? <Link href="/ap/register">Start here.</Link></p>}</section></div>;
}
