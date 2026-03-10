import Link from "next/link"

export default function CarCard({car}:any){

const image=car.image_url.split(",")[0]

return(

<Link href={`/car/${car.id}`}>

<div className="border rounded-lg overflow-hidden hover:shadow-xl transition bg-white">

<img
src={image}
className="w-full h-48 object-cover"
/>

<div className="p-4">

<h2 className="font-bold text-lg">
{car.brand} {car.model}
</h2>

<p className="text-gray-500 text-sm">
ปี {car.year}
</p>

<p className="text-red-600 font-bold text-lg mt-2">
{Number(car.price).toLocaleString()} บาท
</p>

</div>

</div>

</Link>

)

}