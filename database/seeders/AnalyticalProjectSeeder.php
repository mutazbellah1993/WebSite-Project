<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use Illuminate\Database\Seeder;

/**
 * Publishes the "Syria humanitarian situation dashboard" analytical project (bilingual).
 * Safe to re-run: the record is matched by slug and published_at is kept once set.
 * The live dashboard button appears only when ELITEDATA_SYRIA_DASHBOARD_URL is configured.
 */
class AnalyticalProjectSeeder extends Seeder
{
    public function run(): void
    {
        $project = CaseStudy::withTrashed()->firstOrNew(['slug' => 'syria-humanitarian-dashboard']);

        $project->fill([
            'client_name' => null,
            'is_client_public' => false,
            'title_en' => 'Syria Humanitarian Situation Dashboard: Needs, Response and Gaps',
            'title_ar' => 'لوحة الوضع الإنساني في سوريا: الاحتياجات والاستجابة والفجوات',
            'summary_en' => 'An interactive dashboard that brings humanitarian needs, reported response, partner presence, displacement, conflict, food prices and health indicators for Syria into one view, to show where severe needs meet the least response.',
            'summary_ar' => 'لوحة معلومات تفاعلية تجمع الاحتياجات الإنسانية والاستجابة المُبلَّغة وحضور الشركاء والنزوح والنزاع وأسعار الغذاء والمؤشرات الصحية في سوريا في مشهد واحد، لإظهار أين تلتقي الاحتياجات الشديدة بأقل استجابة.',
            'challenge_en' => '<p>Humanitarian data on Syria is published by many organisations, each with its own period, geography and unit. Needs are assessed yearly, response is reported monthly, displacement covers a few months, and some series have documented gaps. Read side by side without care, these sources mislead.</p><p>Decision makers needed one place to answer a simple question: <strong>which communities have severe needs and little or no reported response?</strong></p>',
            'challenge_ar' => '<p>تنشر جهات كثيرة بيانات إنسانية عن سوريا، ولكل جهة فترتها وتغطيتها الجغرافية ووحدتها. فالاحتياجات تُقيَّم سنويًا، والاستجابة تُبلَّغ شهريًا، والنزوح يغطي أشهرًا قليلة، وبعض السلاسل فيها فجوات موثقة. وقراءتها جنبًا إلى جنب دون عناية تؤدي إلى استنتاجات مضلِّلة.</p><p>احتاج صانعو القرار إلى مكان واحد يجيب عن سؤال بسيط: <strong>أي المجتمعات فيها احتياجات شديدة واستجابة قليلة أو معدومة؟</strong></p>',
            'methodology_en' => '<ul><li>Consolidated about 275,000 records from 19 public source tables of the ACAPS Syria Core Dataset (HDX, July 2026 edition; OCHA needs, 4W response and partner presence; IOM; ACLED; WFP; World Bank; WHO; FAO) into one relational model keyed by official place codes, from community to governorate.</li><li>Validated every import: database totals must equal the source totals, or the load fails.</li><li>Replicated the original Power BI measures and compared them with the new calculations on the same data. Matching measures were kept; four defects were found and corrected.</li><li>Stated the period of every figure, because the sources do not cover the same dates.</li></ul>',
            'methodology_ar' => '<ul><li>توحيد نحو 275 ألف سجل من 19 جدول مصدر عام في مجموعة بيانات ACAPS الأساسية عن سوريا (إصدار تموز 2026 على HDX؛ احتياجات OCHA، وخريطة الاستجابة 4W وحضور الشركاء، وIOM، وACLED، وWFP، والبنك الدولي، ومنظمة الصحة العالمية، والفاو) في نموذج علائقي واحد مرتبط بأكواد المواقع الرسمية من المجتمع حتى المحافظة.</li><li>التحقق عند كل استيراد: يجب أن تساوي مجاميع قاعدة البيانات مجاميع المصدر وإلا يفشل التحميل.</li><li>إعادة تنفيذ قياسات Power BI الأصلية ومقارنتها بالحسابات الجديدة على البيانات نفسها. أُبقيت القياسات المتطابقة وصُححت أربعة عيوب وُجدت.</li><li>ذكر فترة كل رقم صراحةً، لأن المصادر لا تغطي التواريخ نفسها.</li></ul>',
            'solution_en' => '<p>A bilingual (Arabic and English) interactive dashboard in seven sections, with the public in mind first and management second:</p><ul><li><strong>Public:</strong> overview, response story, displacement and prices.</li><li><strong>Management:</strong> gap analysis with a transparent priority score, sector performance, risk (conflict, disease alerts, hospitals) and an exportable insights report.</li></ul><p>Four filters (governorate, district, sector, year) drive every chart, and clicking a bar or bubble applies the same filter. The state is kept in the page address so any view can be shared.</p>',
            'solution_ar' => '<p>لوحة معلومات تفاعلية ثنائية اللغة (العربية والإنجليزية) في سبعة أقسام، تخاطب الجمهور أولًا ثم الإدارة:</p><ul><li><strong>للجمهور:</strong> نظرة عامة، وقصة الاستجابة، والنزوح والأسعار.</li><li><strong>للإدارة:</strong> تحليل الفجوات بدرجة أولوية شفافة، وأداء القطاعات، والمخاطر (النزاع وإنذار الأمراض والمشافي)، وتقرير رؤى قابل للطباعة.</li></ul><p>أربعة فلاتر (المحافظة والمنطقة والقطاع والسنة) تتحكم بكل الرسوم، والنقر على عمود أو دائرة يطبّق الفلتر نفسه. وتُحفظ الحالة في عنوان الصفحة فيمكن مشاركة أي عرض.</p>',
            'results_en' => '<p>Headline findings from the data (needs of 2025; response reported January to June 2026, compared with the earlier block of January 2024 to February 2025):</p><ul><li><strong>16.5 million</strong> people in need, and <strong>132 of 270</strong> assessed communities (49%) at severity 4 or 5.</li><li>Reported response reached <strong>all 132</strong> high-severity communities in 2026 (116 of 132 in the earlier block). Sector by sector, <strong>213 of 966</strong> high-severity needs (22%) still have no reported response, mostly where no partner is present (182 of 213); <strong>5.4 million</strong> people live in a community with at least one such gap.</li><li>Shelter (62%), WASH (49%), CCCM (39%) and non-food items (38%) have the highest share of unserved high-severity needs.</li><li>Damascus, Dar’a, Tartous, Rural Damascus and Homs receive well below their share of the need; about 16% of reported volume would have to move to match the geography of need.</li><li>A finding that did not survive new data: in the earlier block Idleb held 17% of the need but 1.1% of the reported response; in 2026 it holds 20%. That gap was a reporting gap, not a delivery gap.</li></ul><p>The analysis also corrected the original measures: high-severity coverage had been overstated (192% instead of 87.9%), the priority score had collapsed to plain severity, a month with no conflict reports had been counted as a real month, and partner presence had been summed across months.</p><p><em>Figures reflect the cited public datasets for the stated periods and are not an official product of the data publishers. Response (4W) values are reported volumes, not unique beneficiaries. The response is published in separate blocks of months (none for March to December 2025) and the analysis never adds months across blocks.</em></p>',
            'results_ar' => '<p>أبرز ما أظهرته البيانات (احتياجات 2025؛ والاستجابة المُبلَّغة من كانون الثاني إلى حزيران 2026، مقارنةً بالكتلة السابقة من كانون الثاني 2024 إلى شباط 2025):</p><ul><li><strong>16.5 مليون</strong> شخص محتاج، و<strong>132 من 270</strong> مجتمعًا مقيَّمًا (49%) بشدة 4 أو 5.</li><li>وصلت الاستجابة المُبلَّغة إلى <strong>كل المجتمعات الـ132</strong> عالية الشدة في 2026 (116 من 132 في الكتلة السابقة). لكن قطاعًا بقطاع ما تزال <strong>213 من 966</strong> احتياجًا شديدًا (22%) بلا استجابة مُبلَّغة، وأغلبها حيث لا شريك حاضر (182 من 213)؛ و<strong>5.4 مليون</strong> شخص يعيشون في مجتمع فيه فجوة كهذه على الأقل.</li><li>المأوى (62%) والمياه والصرف (49%) وإدارة المخيمات (39%) والمواد غير الغذائية (38%) أعلى نسبة احتياجات شديدة غير مخدومة.</li><li>دمشق ودرعا وطرطوس وريف دمشق وحمص تنال أقل بكثير من حصتها من الاحتياج؛ ويلزم أن ينتقل نحو 16% من الحجم المُبلَّغ ليطابق جغرافية الاحتياج.</li><li>نتيجة لم تصمد أمام بيانات جديدة: في الكتلة السابقة كان لإدلب 17% من الاحتياج و1.1% فقط من الاستجابة المُبلَّغة؛ وفي 2026 صار لها 20%. كانت تلك فجوة تبليغ لا تنفيذ.</li></ul><p>وصحّح التحليل عيوبًا في القياسات الأصلية: تغطية المناطق عالية الشدة كانت مضخَّمة (192% بدل 87.9%)، ودرجة الأولوية كانت تنهار إلى الشدة وحدها، وشهر بلا أي بلاغ نزاع كان يُحسب شهرًا فعليًا، وحضور الشركاء كان يُجمع عبر الأشهر.</p><p><em>الأرقام تعكس مجموعات البيانات العامة المذكورة للفترات المحددة، وليست منتجًا رسميًا للجهات الناشرة. وقيم الاستجابة (4W) أحجام مُبلَّغة وليست مستفيدين فريدين. وتُنشر الاستجابة في كتل أشهر منفصلة (لا بيانات لآذار – كانون الأول 2025) ولا يجمع التحليل أشهرًا عبر الكتل.</em></p>',
            'featured_image_path' => '/images/projects/syria-humanitarian-dashboard.png',
            'live_url' => config('elitedata.projects.syria_dashboard_url'),
            'completion_date' => '2026-11-24',
            'is_featured' => true,
            'status' => 'published',
            'seo_title_en' => 'Syria Humanitarian Situation Dashboard | EliteData',
            'seo_title_ar' => 'لوحة الوضع الإنساني في سوريا | EliteData',
            'seo_description_en' => 'Interactive analytical dashboard linking humanitarian needs, response, displacement, conflict and food security in Syria, built from public OCHA, IOM, ACLED, WFP, World Bank, WHO and FAO data.',
            'seo_description_ar' => 'لوحة تحليلية تفاعلية تربط الاحتياجات الإنسانية والاستجابة والنزوح والنزاع والأمن الغذائي في سوريا، مبنية على بيانات عامة من OCHA وIOM وACLED وWFP والبنك الدولي ومنظمة الصحة العالمية والفاو.',
        ]);

        $project->published_at ??= now();
        $project->deleted_at = null;
        $project->save();
    }
}
