'use client'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'
import { useEffect, useState } from 'react'

function formatURL(title: string) {
  const url = `/${title.toLocaleLowerCase().split(' ').join('-')}`
  return url
}

function Item({
  src,
  title,
}: {
  src: string,
  title: string,
}) {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        let url = '/'
        if (title.toLocaleLowerCase() !== 'explore') {
          url = formatURL(title)
        }
        if (title.toLocaleLowerCase() === 'premium') {
          url = '/become-premium'
        }
        if (title.toLocaleLowerCase() === 'account') {
          url = '/personal-center'
        }
        console.log('to new page', url)
        router.push(url)
      }}
      className={`flex flex-col items-center space-y-1 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer`}
    >
      <Image width={24} height={24} src={src} alt={title} />
      <div>{title}</div>
    </div>
  )
}

export default function FooterNav() {
  const [footerNavShow, setFooterNavShow] = useState(true)
  const path = usePathname()
  useEffect(() => {
    console.log('emitter on first')
    emitter.on(FOOTER_NAV_EVENT, (show: any) => {
      console.log('----------show data----------', show);
      setFooterNavShow(show)
    });
  }, [])

  return (
    <div className='z-50 fixed left-0 -bottom-[1px] w-[100vw] h-14 border-t border-[rgba(255,255,255,0.16)] bg-[#121112] text-[rgba(255,255,255,0.64)] text-xs flex items-center justify-around'
      style={{ visibility: footerNavShow ? 'visible' : 'hidden' }}
    >
      <Item
        src={path === '/' ? '/assets/exploreSelected.png' : '/assets/explore.png'}
        title="Explore"
      />
      <Item
        src={path === '/chat' ? '/assets/chatSelected.png' : '/assets/chat.png'}
        title="Chat"
      />
      <Item
        src={path === '/become-premium' ? '/assets/becomePremiumSelected.png' : '/assets/becomePremium.png'}
        title="Premium"
      />
      <Item
        src={path === '/personal-center' ? '/assets/accountSelected.png' : '/assets/account.png'}
        title="Account"
      />
    </div>
  )
}

