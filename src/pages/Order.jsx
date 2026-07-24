import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import OrderForm from "../components/order/OrderForm"
import SEO from "../components/seo/SEO"
import IllustratedPanel from "../components/common/IllustratedPanel"
import { brand, product } from "../lib/constants"
import { breadcrumbJsonLd, productJsonLd, seo } from "../lib/seo"
import { useSitePhotoSlots } from "../lib/useSitePhotoSlots"

function JarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.5h11v9H3Z" />
      <path d="M14 10.5h4l3 3v2h-7Z" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </svg>
  )
}

function BeefIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6.5h12" />
      <path d="M8 4.5h8" />
      <path d="M7 9.5c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4v7c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4v-7Z" />
      <path d="M9.5 13.5h5" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 5 6v5.5c0 4.2 3 7.5 7 9 4-1.5 7-4.8 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19.4s-6.4-3.9-8.4-7.6C2.3 9 3.6 6 6.5 6c1.8 0 3.2 1.1 3.9 2.4C11.1 7.1 12.5 6 14.3 6c2.9 0 4.2 3 3 5.8-2 3.7-8.4 7.6-8.4 7.6Z" />
    </svg>
  )
}

const trustPoints = [
  { title: "Metro Manila Delivery", icon: <TruckIcon /> },
  { title: "100% Pure Beef", icon: <BeefIcon /> },
  { title: "Secure Checkout", icon: <ShieldIcon /> },
  { title: "Made with Care", icon: <HeartIcon /> },
]

const Order = () => {
  const photos = useSitePhotoSlots()

  return (
    <main className="min-h-screen kk-bg-blush text-[#171717]">
      <SEO
        title={seo.orderTitle}
        description={seo.orderDescription}
        path="/order"
        type="product"
        jsonLd={({ canonicalUrl, imageUrl }) => [
          productJsonLd({ canonicalUrl, imageUrl }),
          breadcrumbJsonLd([
            { name: "Home", url: canonicalUrl.replace(/\/order$/, "/") },
            { name: "Order", url: canonicalUrl },
          ]),
        ]}
      />
      <Header />

      <section className="kk-order-intro kk-bg-plain px-5 py-14 min-[421px]:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="kk-fade-in">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
              Order Online
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-5xl">
              {brand.name}
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-[#5F5B58]">
              Kuya King&apos;s Beef Tapa is made with pure beef, a
              homemade-style marinade, and slow-cooked flavor for easy
              everyday meals. Pick your product below and we&apos;ll
              confirm your order shortly after.
            </p>

            <div className="mt-6 flex items-center gap-3 text-sm font-black text-[#17191C]">
              <span>{product.packSize}</span>
              <span className="text-[#c91f3a]">&bull;</span>
              <span>Starting at &#8369;{brand.pricePerPack}</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#E8E1DE] pt-6 sm:grid-cols-4">
              {trustPoints.map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c91f3a]/30 bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6]">
                    {item.icon}
                  </div>
                  <p className="text-xs font-bold leading-4 text-[#5F5B58]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <IllustratedPanel
            icon={<JarIcon />}
            caption="Beef Tapa"
            label="Homemade & sealed fresh"
            imageUrl={photos.product}
            imageAlt="Kuya King's Beef Tapa"
            className="kk-fade-in h-64 w-full rounded-lg min-[421px]:h-80 lg:h-[380px]"
            style={{ animationDelay: "120ms" }}
          />
        </div>
      </section>

      <OrderForm />

      <Footer />
    </main>
  )
}

export default Order
