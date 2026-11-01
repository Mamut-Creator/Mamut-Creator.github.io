type Machine = {title:string;slug:string;platform:string;os:string;difficulty:string;tags:string[];summary:string;cover?:string;icon?:string;machineUrl?:string;demo?:boolean;status?:string};
type Post = {frontmatter:Machine;Content:any;getHeadings:()=>{depth:number;slug:string;text:string}[]};
const modules = import.meta.glob<Post>('../content/writeups/*/index.md',{eager:true});
const images = import.meta.glob<string>('../content/writeups/**/*.{png,jpg,jpeg,webp,avif,svg}',{eager:true,query:'?url',import:'default'});
export const posts = Object.entries(modules).map(([path,post])=>{
  const folder=path.slice(0,path.lastIndexOf('/'));
  const cover = post.frontmatter.cover ? images[`${folder}/${post.frontmatter.cover.replace(/^\.\//,'')}`] : undefined;
  if(post.frontmatter.cover && !cover) throw new Error(`Portada no encontrada: ${folder}/${post.frontmatter.cover}`);
  const icon = post.frontmatter.icon ? images[`${folder}/${post.frontmatter.icon.replace(/^\.\//,'')}`] : undefined;
  if(post.frontmatter.icon && !icon) throw new Error(`Icono no encontrado: ${folder}/${post.frontmatter.icon}`);
  const machineUrl=post.frontmatter.machineUrl;
  if(machineUrl && !/^https?:\/\//i.test(machineUrl)) throw new Error(`machineUrl debe ser un enlace http(s): ${path}`);
  return {...post,cover,icon};
});
if(new Set(posts.map(p=>p.frontmatter.slug)).size!==posts.length)throw new Error('Cada máquina debe tener un slug único');
