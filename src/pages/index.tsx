import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <div className='typora-export-content'>
        <div id='write' className=''><h1 id='notion2markdown-sync'><span>Notion2markdown-sync</span></h1><p><span>A vercel tool to trigger the workflow of GitHub repository, using webhook.</span></p><h1 id='actions'><span>Actions</span></h1><ul><li><a href='./api/notion_sync'><span>Notion Sync</span></a></li><li><a href='./api/deploy'><span>Deploy</span></a></li></ul><h1 id='author'><span>Author</span></h1><p><span>Dorad, </span><a href='mailto:ddxid@outlook.com' target='_blank' className='url'>ddxid@outlook.com</a></p><h1 id='blog'><span>Blog</span></h1><p><a href='https://blog.cuger.cn'></a></p><h1 id='github'><span>Github</span></h1><p><a href='https://github.com/Doradx'><span>Doradx (github.com)</span></a></p></div></div>
    </main>
  )
}
