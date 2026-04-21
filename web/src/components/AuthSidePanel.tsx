/** Insets do frame OBJECTS (Figma Login 1213:221) — composição dos cães */
const DOG_INSETS = [
  'inset-[12.62%_63.7%_0_15.09%]',
  'inset-[24.43%_0_0_80.06%]',
  'inset-[38.73%_19.64%_0_64.65%]',
  'inset-[0_32.73%_0_45.9%]',
  'inset-[46.59%_49.96%_0_27.58%]',
  'inset-[53.78%_81.95%_0_0]',
] as const

export function AuthSidePanel({
  assets,
}: {
  assets: { logo: string; dogs: readonly string[] }
}) {
  return (
    <aside className="flex min-h-[280px] w-full shrink-0 flex-col justify-between rounded-[20px] bg-[#f15156] px-6 pb-6 pt-10 md:min-h-[661px] md:w-[min(100%,488px)] md:px-8">
      <div className="flex justify-center">
        <img
          src={assets.logo}
          alt="Find a Friend"
          className="h-[45px] w-[174px] object-contain"
        />
      </div>
      <div className="relative mx-auto mt-6 h-[195px] w-full max-w-[384px] overflow-hidden rounded-[30px]">
        {assets.dogs.map((src, i) => (
          <div
            key={src}
            className={`absolute ${DOG_INSETS[i] ?? 'inset-0'}`}
          >
            <img alt="" src={src} className="absolute inset-0 block size-full max-w-none" />
          </div>
        ))}
      </div>
    </aside>
  )
}
