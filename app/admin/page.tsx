"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function AdminPage(){

const [files,setFiles] = useState<File[]>([])
const [preview,setPreview] = useState<string[]>([])
const [cars,setCars] = useState<any[]>([])
const [loading,setLoading] = useState(false)


// โหลดรถทั้งหมด
const fetchCars = async ()=>{

const {data} = await supabase
.from("cars")
.select("*")
.order("created_at",{ascending:false})

setCars(data || [])

}

useEffect(()=>{
fetchCars()
},[])


// เลือกรูป
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

if (!e.target.files) return

const selected = Array.from(e.target.files) as File[]

setFiles(selected)

const previews = selected.map((file) =>
URL.createObjectURL(file)
)

setPreview(previews)

}


// ลงประกาศรถ
const handleSubmit = async(e:any)=>{

e.preventDefault()

setLoading(true)

const form = new FormData(e.target)

let imageUrls:string[]=[]


// upload รูป
for(const file of files){

const fileName = Date.now()+"-"+file.name.replace(/\s/g,"")

const {error:uploadError} = await supabase.storage
.from("car-images")
.upload(fileName,file)

if(uploadError){
alert("Upload error")
return
}

const {data} = supabase.storage
.from("car-images")
.getPublicUrl(fileName)

imageUrls.push(data.publicUrl)

}


// insert DB
await supabase.from("cars").insert({

brand:form.get("brand"),
model:form.get("model"),
year:form.get("year"),
price:form.get("price"),
mileage:form.get("mileage"),
description:form.get("description"),
image_url:imageUrls.join(",")

})

alert("เพิ่มรถสำเร็จ")

setFiles([])
setPreview([])

e.target.reset()

fetchCars()

setLoading(false)

}



// ลบรถ + ลบรูป
const handleDelete = async(car:any)=>{

if(!confirm("ต้องการลบรถคันนี้ใช่ไหม")) return

const images = car.image_url.split(",")

for(const img of images){

const path = img.split("/car-images/")[1]

await supabase.storage
.from("car-images")
.remove([path])

}

await supabase
.from("cars")
.delete()
.eq("id",car.id)

alert("ลบสำเร็จ")

fetchCars()

}


return(

<div className="max-w-6xl mx-auto p-10">


<h1 className="text-3xl font-bold mb-10">
🛠 ระบบ Admin ขายรถ
</h1>



{/* ฟอร์มเพิ่มรถ */}

<form
onSubmit={handleSubmit}
className="bg-white p-6 rounded-xl shadow space-y-4"
>

<h2 className="text-xl font-bold">
ลงขายรถ
</h2>

<input
name="brand"
placeholder="ยี่ห้อ"
className="border p-3 w-full rounded"
/>

<input
name="model"
placeholder="รุ่น"
className="border p-3 w-full rounded"
/>

<input
name="year"
placeholder="ปี"
className="border p-3 w-full rounded"
/>

<input
name="price"
placeholder="ราคา"
className="border p-3 w-full rounded"
/>

<input
name="mileage"
placeholder="เลขไมล์"
className="border p-3 w-full rounded"
/>


{/* Upload */}

<input
type="file"
multiple
accept="image/*"
onChange={handleFileChange}
className="border p-3 w-full"
/>


{/* preview */}

{preview.length>0 &&(

<div className="grid grid-cols-4 gap-4">

{preview.map((img,i)=>(
<img
key={i}
src={img}
className="h-24 w-full object-cover rounded"
/>
))}

</div>

)}


<textarea
name="description"
placeholder="รายละเอียด"
className="border p-3 w-full rounded"
/>


<button
disabled={loading}
className="bg-red-600 text-white px-6 py-3 rounded-lg"
>

{loading ? "กำลังบันทึก..." : "บันทึกรถ"}

</button>

</form>



{/* รายการรถ */}

<div className="mt-14">

<h2 className="text-2xl font-bold mb-6">
📦 รถทั้งหมดในระบบ
</h2>

<div className="space-y-4">

{cars.map((car)=>{

const img = car.image_url?.split(",")[0]

return(

<div
key={car.id}
className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
>

<div className="flex items-center gap-4">

<img
src={img}
className="w-28 h-20 object-cover rounded"
/>

<div>

<p className="font-bold">
{car.brand} {car.model}
</p>

<p className="text-sm text-gray-500">
ปี {car.year}
</p>

<p className="text-red-600 font-bold">
{Number(car.price).toLocaleString()} บาท
</p>

</div>

</div>


<button
onClick={()=>handleDelete(car)}
className="bg-red-500 text-white px-4 py-2 rounded"
>

ลบ

</button>

</div>

)

})}

</div>

</div>

</div>

)

}