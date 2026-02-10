import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Serie from "base/models/Serie";
import Brand from "base/models/Brand";


export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

      

        const serie = await Serie.findOne({_id:id}).populate("brand");

        if (!serie) {
            return NextResponse.json({ error: "سری مورد نظر یافت نشد" }, { status: 404 });
        }

        return NextResponse.json(serie, { status: 200 });
    } catch (error) {

        console.error("GET Single Serie Error:", error);
        return NextResponse.json({ error: "خطا در بازیابی اطلاعات سری" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDB();
        const { id } =await params;
        const body = await req.json();

        // ۱. بررسی وجود آیتم قبل از هر کاری
        const serie = await Serie.findById(id);
        if (!serie) {
            return NextResponse.json({ error: "سری مورد نظر یافت نشد" }, { status: 404 });
        }

        // ۲. اگر برند تغییر کرده، صحت وجود برند جدید بررسی شود
        if (body.brand) {
            const brandExists = await Brand.findById(body.brand);
            if (!brandExists) {
                return NextResponse.json({ error: "برند جدید معتبر نیست" }, { status: 404 });
            }
        }

        // ۳. به‌روزرسانی فیلدها
        // استفاده ازfindByIdAndUpdate باعث می‌شود فیلدها مستقیم آپدیت شوند
        // اما برای اجرای Middleware های pre-save، بهتر است مقادیر را ست کنیم
        Object.keys(body).forEach((key) => {
            serie[key] = body[key];
        });

        await serie.save();

        return NextResponse.json(
            { message: "به‌روزرسانی با موفقیت انجام شد", data: serie },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "خطا در ویرایش اطلاعات" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDB();
        const { id } =await params;

        // ۱. پیدا کردن و حذف
        const serie = await Serie.findById(id);
        if (!serie) {
            return NextResponse.json({ error: "سری یافت نشد" }, { status: 404 });
        }

        const brandId = serie.brand;

        // ۲. حذف سری از دیتابیس
        await Serie.findByIdAndDelete(id);

        if (brandId) {
            await Brand.findByIdAndUpdate(brandId, {
                $pull: { series: id }
            });
        }
        /* نکته حرفه‌ای: اگر مدل‌های دیگری مثل "Product" دارید، 
           بهتر است اینجا بررسی کنید که اگر محصولی به این سری متصل است، حذف انجام نشود.
           یا محصولات مرتبط را هم مدیریت کنید.
        */

        return NextResponse.json(
            { message: "سری و اسلاگ مربوطه با موفقیت حذف شدند" },
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "خطا در عملیات حذف" }, { status: 500 });
    }
}