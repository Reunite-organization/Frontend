import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  View, Search, Users, Globe, Shield, Zap, MapPin,
  Clock, Smartphone, MessageCircle, Brain, Eye, Phone,
  Satellite, Bot, Radio, Star, ChevronRight, HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../lib/i18n';

const ReadMorePage = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');

  const t = (en, am) => language === 'am' ? am : en;

  const sections = [
    { id: 'overview', label: t('Overview', 'አጠቃላይ እይታ'), icon: View },
    { id: 'how-it-works', label: t('How It Works', 'እንዴት እንደሚሰራ'), icon: Search },
    { id: 'technology', label: t('Technology', 'ቴክኖሎጂ'), icon: Brain },
    { id: 'search-system', label: t('Search System', 'የፍለጋ ስርዓት'), icon: MapPin },
    { id: 'channels', label: t('Channels', 'መገናኛ መንገዶች'), icon: Smartphone },
    { id: 'safety', label: t('Safety & Privacy', 'ደህንነትና ግላዊነት'), icon: Shield },
    { id: 'community', label: t('Community', 'ማህበረሰብ'), icon: Users },
  ];

  const StatBox = ({ value, label, labelAm }) => (
    <div className="p-3 bg-white rounded border border-gray-100 text-center">
      <div className="text-lg font-semibold text-gray-700">{value}</div>
      <div className="text-xs text-black mt-0.5">{t(label, labelAm)}</div>
    </div>
  );

  const InfoCard = ({ icon: Icon, title, titleAm, children }) => (
    <div className="p-4 bg-white rounded border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="font-medium text-gray-700 text-sm">{t(title, titleAm)}</span>
      </div>
      <div className="text-sm text-gray-500 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('What is Reunite?', 'Reunite ምንድን ነው?')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('Last updated: April 2026', 'የተሻሻለው፡ ሚያዚያ 2018')}
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t(
                'Reunite is a cross-platform coordination system designed to help locate missing persons faster. It combines three powerful elements: intelligent report processing that extracts critical information from any format, a network of community volunteers ready to assist in searches, and multiple communication channels to reach the right people at the right time.',
                'Reunite የጎደሉ ሰዎችን በፍጥነት ለማግኘት የተነደፈ ስርዓት ነው። ሶስት ዋና ነገሮችን ያጣምራል፡ መረጃን በራሱ የሚያወጣ ብልህ ስርዓት፣ በፍለጋ ለመርዳት ዝግጁ የሆኑ በጎ ፈቃደኞች ኔትወርክ፣ እና ትክክለኛውን ሰው በትክክለኛው ጊዜ ለማግኘት የተለያዩ የመገናኛ መንገዶች።'
              )}
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {t(
                'The platform is accessible through our website (works on any device), Telegram bot, WhatsApp messages, and SMS. Whether you have a smartphone or just a basic phone, you can report a missing person and receive updates. Our system is built with privacy and security at its core, ensuring personal data is protected and deleted after cases are resolved.',
                'ይህ መድረክ በድህረ ገጻችን (በማንኛውም መሳሪያ የሚሰራ)፣ በቴሌግራም ቦት፣ በዋትስአፕ እና በኤስኤምኤስ በኩል መጠቀም ይቻላል። ስማርትፎንም ሆነ ቀላል ስልክ ቢኖርዎት የጎደለን ሰው ሪፖርት ማድረግ እና ዝመናዎችን መቀበል ይችላሉ። ስርዓታችን ግላዊ መረጃን በመጠበቅ እና ጉዳዮች ከተፈቱ በኋላ በማጥፋት ደህንነትን መሰረት አድርጎ የተሰራ ነው።'
              )}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox value="< 10 sec" label="Report Processing" labelAm="የሪፖርት ማቀናበሪያ" />
              <StatBox value="4 Channels" label="Ways to Connect" labelAm="የመገናኛ መንገዶች" />
              <StatBox value="100+" label="Active Volunteers" labelAm="ንቁ በጎ ፈቃደኞች" />
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {t('What You Can Do on Reunite', 'በReunite ምን ማድረግ ይችላሉ')}
            </h3>
            <div className="space-y-3">
              <InfoCard icon={Phone} title="Report a Missing Person" titleAm="የጎደለ ሰው ሪፖርት ያድርጉ">
                <p>{t(
                  'If someone you know is missing, you can create a report immediately. Just describe who they are, what they were wearing, and where they were last seen. You can type it, speak it, or upload a photo. Our system processes it in seconds, assigns a unique case number, and sends you a confirmation message.',
                  'የሚያውቁት ሰው ከጠፋ ወዲያውኑ ሪፖርት መፍጠር ይችላሉ። ማንነታቸውን፣ የለበሱትን ልብስ እና ለመጨረሻ ጊዜ የታዩበትን ቦታ ይግለጹ። መጻፍ፣ መናገር ወይም ፎቶ መላክ ይችላሉ። ስርዓታችን በሰከንዶች ውስጥ ያካሂደዋል፣ ልዩ የጉዳይ ቁጥር ይሰጣል እና የማረጋገጫ መልእክት ይልካል።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Users} title="Volunteer to Help" titleAm="ለመርዳት በጎ ፈቃደኛ ይሁኑ">
                <p>{t(
                  'Sign up as a volunteer to receive alerts when someone goes missing in your area. When a case matches your location, you get notified with details and a suggested search zone. You can accept or decline each assignment. Volunteers are the View of Reunite — every pair of eyes helps.',
                  'በአካባቢዎ ሰው ሲጠፋ ማስጠንቀቂያ ለመቀበል እንደ በጎ ፈቃደኛ ይመዝገቡ። አንድ ጉዳይ ከእርስዎ አካባቢ ጋር ሲዛመድ፣ ዝርዝር መረጃ እና የተጠቆመ የፍለጋ ዞን ይደርስዎታል። እያንዳንዱን ምደባ መቀበል ወይም አለመቀበል ይችላሉ። በጎ ፈቃደኞች የReunite ልብ ናቸው — እያንዳንዱ ዓይን ይረዳል።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Search} title="Track Active Cases" titleAm="ንቁ ጉዳዮችን ይከታተሉ">
                <p>{t(
                  'Browse the public map to see active search zones in your area. Each case shows the missing person\'s description, last seen location, and how long they\'ve been missing. You can subscribe to specific cases to receive updates directly. Cases marked HIGH priority are urgent and need immediate attention.',
                  'በአካባቢዎ ያሉ ንቁ የፍለጋ ዞኖችን ለማየት የህዝብ ካርታውን ያስሱ። እያንዳንዱ ጉዳይ የጎደለውን ሰው መግለጫ፣ ለመጨረሻ ጊዜ የታየበትን ቦታ እና ለምን ያህል ጊዜ እንደጠፋ ያሳያል። ዝመናዎችን በቀጥታ ለመቀበል ለተወሰኑ ጉዳዮች መመዝገብ ይችላሉ። HIGH ቅድሚያ ምልክት የተደረገባቸው ጉዳዮች አስቸኳይ ናቸው።'
                )}</p>
              </InfoCard>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-100">
              <p className="text-sm text-blue-700">
                <HelpCircle className="w-4 h-4 inline mr-1" />
                {t(
                  'New to Reunite? Start by browsing active cases or registering as a volunteer.',
                  'በReunite አዲስ ነዎት? ንቁ ጉዳዮችን በማሰስ ወይም እንደ በጎ ፈቃደኛ በመመዝገብ ይጀምሩ።'
                )}
              </p>
            </div>
          </div>
        );

      case 'how-it-works':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('How Reunite Works', 'Reunite እንዴት ይሰራል')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('From report to resolution — the complete process', 'ከሪፖርት እስከ መፍትሄ — ሙሉ ሂደቱ')}
            </p>

            {[
              {
                step: 1,
                icon: Phone,
                title: t('Report Submission', 'ሪፖርት ማስገባት'),
                desc: t(
                  'Anyone can submit a missing person report through our website, Telegram bot (@reunite_bot), WhatsApp message, or SMS. You can describe the person in text, record a voice note, or upload a photo. The more details you provide, the faster the system can process it. Required: name or description, last seen location, and approximate time.',
                  'ማንኛውም ሰው በድህረ ገጻችን፣ በቴሌግራም ቦት (@reunite_bot)፣ በዋትስአፕ መልእክት ወይም በኤስኤምኤስ የጎደለ ሰው ሪፖርት ማስገባት ይችላል። ሰውየውን በጽሁፍ መግለጽ፣ የድምጽ ማስታወሻ መቅዳት ወይም ፎቶ መላክ ይችላሉ። በተቻለ መጠን ብዙ ዝርዝር ሲሰጡ ስርዓቱ በፍጥነት ያካሂደዋል። የሚያስፈልጉ፡ ስም ወይም መግለጫ፣ ለመጨረሻ ጊዜ የታዩበት ቦታ እና ግምታዊ ሰዓት።'
                ),
              },
              {
                step: 2,
                icon: Brain,
                title: t('Intelligent Processing', 'ብልህ ማቀናበር'),
                desc: t(
                  'Within 10 seconds, the system analyzes your report and extracts key information: person\'s name, age, gender, clothing description, distinguishing features (scars, tattoos, etc.), and urgency indicators (child, elderly, medical conditions). A confidence score is assigned. If the system isn\'t sure, a human coordinator reviews before publishing.',
                  'በ10 ሰከንድ ውስጥ ስርዓቱ ሪፖርትዎን ይመረምራል እና ቁልፍ መረጃዎችን ያወጣል፡ የሰውየው ስም፣ እድሜ፣ ጾታ፣ የልብስ መግለጫ፣ መለያ ባህሪያት (ጠባሳ፣ ንቅሳት፣ ወዘተ) እና የአስቸኳይነት አመልካቾች (ልጅ፣ አረጋዊ፣ የጤና ችግሮች)። የእምነት ነጥብ ይሰጣል። ስርዓቱ እርግጠኛ ካልሆነ ከማተሙ በፊት አንድ አስተባባሪ ይገመግማል።'
                ),
              },
              {
                step: 3,
                icon: MapPin,
                title: t('Search Zone Creation', 'የፍለጋ ዞን መፍጠር'),
                desc: t(
                  'The system generates at least 3 priority search zones based on the last seen location. Each zone gets a probability score considering: time since disappearance, age of person, weather conditions, time of day, and area type (city, suburb, rural). Higher priority zones are larger and shown first to volunteers.',
                  'ስርዓቱ ለመጨረሻ ጊዜ በታዩበት ቦታ ላይ በመመስረት ቢያንስ 3 ቅድሚያ የሚሰጣቸው የፍለጋ ዞኖችን ያመነጫል። እያንዳንዱ ዞን የመሆን እድል ነጥብ ያገኛል፡ ከጠፋበት ጊዜ፣ የሰውየው እድሜ፣ የአየር ሁኔታ፣ የቀኑ ሰዓት እና የአካባቢ አይነት (ከተማ፣ ዳርቻ፣ ገጠር) ግምት ውስጥ ያስገባል። ከፍተኛ ቅድሚያ ያላቸው ዞኖች ሰፋ ያሉ እና መጀመሪያ ለበጎ ፈቃደኞች የሚታዩ ናቸው።'
                ),
              },
              {
                step: 4,
                icon: Users,
                title: t('Volunteer Notification', 'ለበጎ ፈቃደኞች ማሳወቂያ'),
                desc: t(
                  'Registered volunteers within range of the search zones are automatically notified through their preferred channel (Telegram, WhatsApp, SMS, or web push). Each volunteer can have up to 3 active assignments. If no one accepts within 30 minutes, the radius expands. Volunteers see a map of their assigned zone and can report sightings directly.',
                  'በፍለጋ ዞኖቹ አቅራቢያ ያሉ የተመዘገቡ በጎ ፈቃደኞች በመረጡት የመገናኛ መንገድ (ቴሌግራም፣ ዋትስአፕ፣ ኤስኤምኤስ ወይም የድህረ ገጽ ማስጠንቀቂያ) በራስ-ሰር ይነገራቸዋል። እያንዳንዱ በጎ ፈቃደኛ እስከ 3 ንቁ ምደባዎች ሊኖሩት ይችላል። በ30 ደቂቃ ውስጥ ማንም ካልተቀበለ ራዲየሱ ይስፋፋል። በጎ ፈቃደኞች የተመደቡበትን ዞን ካርታ ያዩና ያዩትን በቀጥታ ሪፖርት ያደርጋሉ።'
                ),
              },
              {
                step: 5,
                icon: Search,
                title: t('Search & Sighting Reports', 'ፍለጋ እና የእይታ ሪፖርቶች'),
                desc: t(
                  'Volunteers search their assigned zones and report findings through a rapid interface (3 taps to report). The system tracks which areas have been searched to prevent duplicate efforts. Coverage maps update in real-time so coordinators can see progress. If someone spots the missing person, a priority alert goes out immediately.',
                  'በጎ ፈቃደኞች የተመደቡበትን ዞን ይፈልጉና በፈጣን ማስተላለፊያ (ለማሳወቅ 3 ንክኪ ብቻ) ሪፖርት ያደርጋሉ። ስርዓቱ ተደጋጋሚ ጥረቶችን ለመከላከል የትኞቹ ቦታዎች እንደተፈለጉ ይከታተላል። አስተባባሪዎች እድገቱን ማየት እንዲችሉ የሽፋን ካርታዎች በቅጽበት ይሻሻላሉ። አንድ ሰው የጎደለውን ሰው ካየ ወዲያውኑ ቅድሚያ የሚሰጠው ማስጠንቀቂያ ይላካል።'
                ),
              },
              {
                step: 6,
                icon: View,
                title: t('Resolution & Verification', 'መፍትሄ እና ማረጋገጫ'),
                desc: t(
                  'When the person is found, the system requires verification before announcing publicly. Multiple steps may be needed: photo confirmation, family verification, or official documentation. Only after verification is the case marked as resolved. Personal data is automatically deleted 90 days after resolution. Families can share their story to help others.',
                  'ሰውየው ሲገኝ ስርዓቱ በይፋ ከማሳወቁ በፊት ማረጋገጫ ይጠይቃል። ብዙ ደረጃዎች ሊያስፈልጉ ይችላሉ፡ የፎቶ ማረጋገጫ፣ የቤተሰብ ማረጋገጫ ወይም ይፋዊ ሰነዶች። ከተረጋገጠ በኋላ ብቻ ጉዳዩ እንደተፈታ ምልክት ይደረጋል። የግል መረጃ ከተፈታ ከ90 ቀናት በኋላ በራስ-ሰር ይደመሰሳል። ቤተሰቦች ሌሎችን ለመርዳት ታሪካቸውን ማካፈል ይችላሉ።'
                ),
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-white text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 mt-1">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="w-4 h-4 text-black" />
                    <span className="font-medium text-black">{s.title}</span>
                  </div>
                  <p className="text-sm text- leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'technology':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('Technology Behind Reunite', 'ከReunite በስተጀርባ ያለው ቴክኖሎጂ')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('How we process reports and coordinate searches', 'ሪፖርቶችን እንዴት እንደምናካሂድ እና ፍለጋዎችን እንደምናስተባብር')}
            </p>

            <div className="space-y-4">
              <InfoCard icon={Brain} title="Report Processing Engine" titleAm="የሪፖርት ማቀናበሪያ ሞተር">
                <p>{t(
                  'When you submit a report, our system uses Google Gemini to analyze the text, voice, or image you provided. It extracts structured data: name, age, clothing colors, distinguishing marks, and location references. This happens in under 10 seconds. If Gemini is unavailable, the system automatically switches to OpenRouter with multiple backup models, ensuring 99.9% processing reliability.',
                  'ሪፖርት ሲያስገቡ ስርዓታችን Google Gemini በመጠቀም ያቀረቡትን ጽሁፍ፣ ድምጽ ወይም ምስል ይመረምራል። የተዋቀረ መረጃ ያወጣል፡ ስም፣ እድሜ፣ የልብስ ቀለሞች፣ መለያ ምልክቶች እና የቦታ ማጣቀሻዎች። ይህ ከ10 ሰከንድ ባነሰ ጊዜ ውስጥ ይከናወናል። Gemini ካልተገኘ ስርዓቱ በራሱ ወደ OpenRouter ይቀየራል፣ ይህም 99.9% የማቀናበር አስተማማኝነትን ያረጋግጣል።'
                )}</p>
              </InfoCard>

              <InfoCard icon={MapPin} title="Priority Calculation" titleAm="የቅድሚያ ስሌት">
                <p>{t(
                  'Not all cases are equal. The system automatically calculates priority based on multiple factors: age (children under 12 and elderly over 70 get highest priority), time missing (first 24 hours are critical), medical conditions mentioned, weather at last seen location (extreme heat/cold increases urgency), and time of day (nighttime searches need faster response). Each factor contributes to a 0-100 priority score.',
                  'ሁሉም ጉዳዮች እኩል አይደሉም። ስርዓቱ በተለያዩ ምክንያቶች ላይ በመመስረት ቅድሚያ በራሱ ያሰላል፡ እድሜ (ከ12 አመት በታች ህጻናት እና ከ70 በላይ አረጋውያን ከፍተኛ ቅድሚያ ያገኛሉ)፣ የጠፋበት ጊዜ (የመጀመሪያዎቹ 24 ሰዓታት ወሳኝ ናቸው)፣ የተጠቀሱ የጤና ችግሮች፣ ለመጨረሻ ጊዜ በታየበት ቦታ ያለው የአየር ሁኔታ (ከፍተኛ ሙቀት/ቅዝቃዜ አስቸኳይነትን ይጨምራል) እና የቀኑ ሰዓት (የሌሊት ፍለጋዎች ፈጣን ምላሽ ያስፈልጋቸዋል)። እያንዳንዱ ምክንያት ከ0-100 ለሚሆነው የቅድሚያ ነጥብ አስተዋጽኦ ያደርጋል።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Shield} title="Confidence & Human Review" titleAm="እምነት እና ሰዋዊ ግምገማ">
                <p>{t(
                  'Every extraction includes a confidence score (0-100%). Results above 60% are published automatically. Between 40-60% are flagged for quick coordinator review. Below 40% requires mandatory human verification before any action is taken. This ensures that incorrect information is never automatically broadcast to volunteers.',
                  'እያንዳንዱ የተወጣ መረጃ የእምነት ነጥብ (0-100%) ያካትታል። ከ60% በላይ ውጤቶች በራስ-ሰር ይታተማሉ። ከ40-60% መካከል ያሉት ለፈጣን አስተባባሪ ግምገማ ምልክት ይደረግባቸዋል። ከ40% በታች የሆኑት ምንም አይነት እርምጃ ከመወሰዱ በፊት የግዴታ ሰዋዊ ማረጋገጫ ያስፈልጋቸዋል። ይህ የተሳሳተ መረጃ በራስ-ሰር ለበጎ ፈቃደኞች እንደማይሰራጭ ያረጋግጣል።'
                )}</p>
              </InfoCard>
            </div>
          </div>
        );

      case 'search-system':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('How the Search System Works', 'የፍለጋ ስርዓቱ እንዴት ይሰራል')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('Understanding search zones, assignments, and tracking', 'የፍለጋ ዞኖችን፣ ምደባዎችን እና ክትትልን መረዳት')}
            </p>

            <div className="space-y-4">
              <InfoCard icon={MapPin} title="Search Zones Explained" titleAm="የፍለጋ ዞኖች ማብራሪያ">
                <p>{t(
                  'When a case is created, the system draws circles around the last known location. The first circle (Zone A) is the highest priority — typically 500m radius for urban areas or 2km for rural. Zone B extends further, and Zone C is the widest. Each zone shrinks or grows based on: how long the person has been missing (zones expand over time), their age and mobility, and whether there have been any sightings reported. You can see these zones on the public map and choose to search in one near you.',
                  'ጉዳይ ሲፈጠር ስርዓቱ በመጨረሻው የታወቀ ቦታ ዙሪያ ክበቦችን ይስላል። የመጀመሪያው ክበብ (ዞን ሀ) ከፍተኛ ቅድሚያ አለው — በተለምዶ ለከተማ 500ሜ ራዲየስ ወይም ለገጠር 2ኪሜ። ዞን ለ ወደ ፊት ይዘልቃል፣ ዞን ሐ ደግሞ በጣም ሰፊው ነው። እያንዳንዱ ዞን በሚከተሉት ላይ ተመስርቶ ይቀንሳል ወይም ይጨምራል፡ ሰውየው ለምን ያህል ጊዜ እንደጠፋ (ዞኖች ከጊዜ ጋር ይስፋፋሉ)፣ እድሜያቸው እና የመንቀሳቀስ ችሎታቸው፣ እና የተመለከቱ ሪፖርቶች መኖራቸው። እነዚህን ዞኖች በህዝብ ካርታ ላይ ማየት እና በአቅራቢያዎ ያለውን ለመፈለግ መምረጥ ይችላሉ።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Users} title="How Volunteers Get Assigned" titleAm="በጎ ፈቃደኞች እንዴት እንደሚመደቡ">
                <p>{t(
                  'When you register as a volunteer, you set your preferred search radius (how far you\'re willing to travel) and availability hours. When a case appears in your area, you get a notification with: the person\'s description, last seen location, a map of your assigned zone, and time since disappearance. You have 15 minutes to accept or decline. If you accept, the zone is marked as "assigned" and other volunteers see it\'s being handled. You can report findings with just 3 taps: "Nothing Found", "Possible Sighting" (with photo), or "Request Help".',
                  'እንደ በጎ ፈቃደኛ ሲመዘገቡ የሚመርጡትን የፍለጋ ራዲየስ (ምን ያህል ርቀት ለመጓዝ ፈቃደኛ እንደሆኑ) እና የሚገኙበትን ሰዓታት ያስቀምጣሉ። በአካባቢዎ ጉዳይ ሲኖር የሚከተለው ይደርስዎታል፡ የሰውየው መግለጫ፣ ለመጨረሻ ጊዜ የታየበት ቦታ፣ የተመደቡበት ዞን ካርታ እና ከጠፋበት ጊዜ። ለመቀበል ወይም አለመቀበል 15 ደቂቃ አለዎት። ከተቀበሉ ዞኑ "ተመድቧል" ተብሎ ምልክት ይደረጋል እና ሌሎች በጎ ፈቃደኞች እየተስተናበረ መሆኑን ያያሉ። ያገኙትን በ3 ንክኪዎች ብቻ ሪፖርት ማድረግ ይችላሉ፡ "ምንም አልተገኘም"፣ "ሊሆን ይችላል" (ከፎቶ ጋር) ወይም "እርዳታ ጠይቅ"።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Satellite} title="Real-Time Coverage Maps" titleAm="በቅጽበት የሽፋን ካርታዎች">
                <p>{t(
                  'The coverage map is the central view for coordinators and volunteers. It shows: green areas (already searched today), yellow areas (assigned but not yet searched), red areas (high priority, unassigned), and gray areas (not yet in any zone). The map updates every 60 seconds as volunteers submit reports. This prevents the common problem of multiple people searching the same area while other areas are missed completely.',
                  'የሽፋን ካርታው ለአስተባባሪዎች እና ለበጎ ፈቃደኞች ማዕከላዊ እይታ ነው። የሚያሳየው፡ አረንጓዴ ቦታዎች (ዛሬ ተፈልገዋል)፣ ቢጫ ቦታዎች (ተመድበዋል ግን ገና አልተፈለጉም)፣ ቀይ ቦታዎች (ከፍተኛ ቅድሚያ፣ አልተመደቡም) እና ግራጫ ቦታዎች (ገና በማንኛውም ዞን ያልተካተቱ)። በጎ ፈቃደኞች ሪፖርቶችን ሲያስገቡ ካርታው በየ60 ሰከንዱ ይሻሻላል። ይህ ብዙ ሰዎች አንድን ቦታ ሲፈልጉ ሌሎች ቦታዎች ሙሉ በሙሉ የሚቀሩበትን የተለመደ ችግር ይከላከላል።'
                )}</p>
              </InfoCard>
            </div>
          </div>
        );

      case 'channels':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('Communication Channels', 'የመገናኛ መንገዶች')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('How to use Reunite through different platforms', 'Reunite በተለያዩ መድረኮች እንዴት መጠቀም እንደሚቻል')}
            </p>

            <div className="space-y-4">
              <InfoCard icon={Globe} title="Website (Web & Mobile)" titleAm="ድህረ ገጽ (ዌብ እና ሞባይል)">
                <p>{t(
                  'The main website works on any device — computer, tablet, or smartphone. You can: create reports with text, voice, or photos; browse the map of active cases; register as a volunteer and manage your assignments; receive push notifications (even when the browser is closed); and track your search history. No app download needed — it works as a PWA (Progressive Web App) that you can install to your home screen for quick access.',
                  'ዋናው ድህረ ገጽ በማንኛውም መሳሪያ ላይ ይሰራል — ኮምፒውተር፣ ታብሌት ወይም ስማርትፎን። ማድረግ የሚችሉት፡ በጽሁፍ፣ ድምጽ ወይም ፎቶ ሪፖርቶችን መፍጠር፤ የንቁ ጉዳዮችን ካርታ ማሰስ፤ እንደ በጎ ፈቃደኛ መመዝገብ እና ምደባዎችዎን ማስተዳደር፤ የፑሽ ማስታወቂያዎችን መቀበል (ብራውዘሩ ሲዘጋም እንኳ)፤ እና የፍለጋ ታሪክዎን መከታተል። መተግበሪያ ማውረድ አያስፈልግም — ለፈጣን መዳረሻ ወደ መነሻ ስክሪንዎ መጫን የሚችሉት PWA (Progressive Web App) ሆኖ ይሰራል።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Bot} title="Telegram Bot (@reunite_bot)" titleAm="የቴሌግራም ቦት (@reunite_bot)">
                <p>{t(
                  'Search for @reunite_bot on Telegram to: report a missing person by sending a message or photo; receive alerts when cases match your area; share your location to find nearby search zones; and check the status of any case. Commands: /report - submit a new case, /cases - list active cases in your area, /volunteer - register as a volunteer, /status [case-id] - check a case status, /help - see all commands.',
                  '@reunite_bot በቴሌግራም ላይ ይፈልጉ እና፡ መልእክት ወይም ፎቶ በመላክ የጎደለ ሰው ሪፖርት ያድርጉ፤ ጉዳዮች ከአካባቢዎ ጋር ሲዛመዱ ማስጠንቀቂያዎችን ይቀበሉ፤ በአቅራቢያዎ ያሉ የፍለጋ ዞኖችን ለማግኘት አካባቢዎን ያካፍሉ፤ እና የማንኛውም ጉዳይ ሁኔታ ይፈትሹ። ትዕዛዞች፡ /report - አዲስ ጉዳይ ያስገቡ፣ /cases - በአካባቢዎ ያሉ ንቁ ጉዳዮችን ያሳዩ፣ /volunteer - እንደ በጎ ፈቃደኛ ይመዝገቡ፣ /status [የጉዳይ-መታወቂያ] - የጉዳይ ሁኔታ ይፈትሹ፣ /help - ሁሉንም ትዕዛዞች ያዩ።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Phone} title="SMS (Basic Phones)" titleAm="ኤስኤምኤስ (ቀላል ስልኮች)">
                <p>{t(
                  'For areas with limited internet or basic phones, send an SMS to 12345 with the word REPORT followed by the person\'s description. Example: "REPORT Missing boy, 8 years old, blue shirt, last seen near Bole Medhanialem at 3pm". You\'ll receive a confirmation with a case number. Text STATUS [case-number] to check updates. You\'ll only receive messages you\'ve consented to. Maximum 10 messages per hour per number.',
                  'ኢንተርኔት ለሌላቸው አካባቢዎች ወይም ቀላል ስልኮች REPORT የሚለውን ቃል በመቀጠል የሰውየውን መግለጫ በመጨመር ኤስኤምኤስ ወደ 12345 ይላኩ። ምሳሌ፡ "REPORT የጠፋ ወንድ ልጅ፣ 8 አመት፣ ሰማያዊ ሸሚዝ፣ ለመጨረሻ ጊዜ ቦሌ መድኃኒዓለም አካባቢ ከምሽቱ 3 ሰዓት የታየ"። የጉዳይ ቁጥር የያዘ ማረጋገጫ ይደርስዎታል። ዝመናዎችን ለማጣራት STATUS [የጉዳይ-ቁጥር] ብለው ይጻፉ። እርስዎ የተስማሙባቸውን መልእክቶች ብቻ ይቀበላሉ። በአንድ ሰዓት ውስጥ በአንድ ቁጥር ቢበዛ 10 መልእክቶች።'
                )}</p>
              </InfoCard>
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('Safety & Privacy', 'ደህንነት እና ግላዊነት')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('How we protect your data and verify information', 'መረጃዎን እንዴት እንደምንጠብቅ እና መረጃን እንደምናረጋግጥ')}
            </p>

            <div className="space-y-4">
              <InfoCard icon={Shield} title="Data Protection" titleAm="የመረጃ ጥበቃ">
                <p>{t(
                  'All data transmitted to and from Reunite is encrypted using TLS 1.3. Personal information (names, phone numbers, addresses) is stored separately from case data and is automatically deleted 90 days after a case is resolved. Passwords are hashed using industry-standard algorithms. API keys and secrets are never stored in code — they are encrypted at rest and rotated every 90 days. We comply with data protection regulations and support the right to access and delete your data.',
                  'ወደ Reunite የሚላክ እና የሚመጣ ሁሉም መረጃ TLS 1.3 በመጠቀም የተመሰጠረ ነው። የግል መረጃ (ስሞች፣ ስልክ ቁጥሮች፣ አድራሻዎች) ከጉዳይ መረጃ ተለይቶ ይቀመጣል እና ጉዳዩ ከተፈታ ከ90 ቀናት በኋላ በራስ-ሰር ይደመሰሳል። የይለፍ ቃላት በኢንዱስትሪ ደረጃውን የጠበቀ ስልተ-ቀመር በመጠቀም የተመሰጠሩ ናቸው። የኤፒአይ ቁልፎች እና ሚስጥሮች በኮድ ውስጥ ፈጽሞ አይቀመጡም — ሲቀመጡ የተመሰጠሩ ናቸው እና በየ90 ቀኑ ይለወጣሉ። የመረጃ ጥበቃ ደንቦችን እናከብራለን እና ውሂብዎን የማግኘት እና የመሰረዝ መብትን እንደግፋለን።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Eye} title="Found Person Verification" titleAm="የተገኘ ሰው ማረጋገጫ">
                <p>{t(
                  'When someone reports finding a missing person, we never announce it publicly immediately. The system requires multi-step verification: first, the finder must provide a photo or video; second, the family or reporter must confirm it\'s their person; third, for high-profile cases, a coordinator may request official documentation. False claims are logged and the reporting account is flagged. This prevents pranks and ensures only genuine reunions are announced.',
                  'አንድ ሰው የጎደለ ሰው ማግኘቱን ሲዘግብ ወዲያውኑ በይፋ አናሳውቅም። ስርዓቱ ባለብዙ-ደረጃ ማረጋገጫ ይፈልጋል፡ አንደኛ፣ አግኚው ፎቶ ወይም ቪዲዮ ማቅረብ አለበት፤ ሁለተኛ፣ ቤተሰቡ ወይም ሪፖርት አድራጊው የእሳቸው ሰው መሆኑን ማረጋገጥ አለባቸው፤ ሶስተኛ፣ ለከፍተኛ ጉዳዮች አስተባባሪ ይፋዊ ሰነዶችን ሊጠይቅ ይችላል። የውሸት የይገባኛል ጥያቄዎች ይመዘገባሉ እና ሪፖርት ያደረገው መለያ ምልክት ይደረግበታል። ይህ ቀልዶችን ይከላከላል እና እውነተኛ ዳግም መገናኘቶች ብቻ መሆናቸውን ያረጋግጣል።'
                )}</p>
              </InfoCard>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('Community & Getting Involved', 'ማህበረሰብ እና መሳተፍ')}
            </h2>
            <p className="text-xs text-black mb-6">
              {t('How to join, contribute, and make a difference', 'እንዴት መቀላቀል፣ ማበርከት እና ለውጥ ማምጣት እንደሚቻል')}
            </p>

            <div className="space-y-4">
              <InfoCard icon={Users} title="Become a Volunteer" titleAm="በጎ ፈቃደኛ ይሁኑ">
                <p>{t(
                  'Registration takes under 2 minutes. You\'ll need to provide: your name (shown to coordinators only), preferred search radius (1km, 5km, or 10km), availability hours (when you can help), and notification preference (Telegram, WhatsApp, SMS, or web). No training required for basic volunteering. You\'ll start receiving alerts immediately when cases match your criteria. Each search assignment includes a map, description, and simple reporting buttons.',
                  'ምዝገባ ከ2 ደቂቃ በታች ይወስዳል። ማቅረብ ያለብዎት፡ ስምዎ (ለአስተባባሪዎች ብቻ የሚታይ)፣ የሚመርጡት የፍለጋ ራዲየስ (1ኪሜ፣ 5ኪሜ ወይም 10ኪሜ)፣ የሚገኙበት ሰዓታት (መቼ ማገዝ እንደሚችሉ) እና የማሳወቂያ ምርጫ (ቴሌግራም፣ ዋትስአፕ፣ ኤስኤምኤስ ወይም ዌብ)። ለመሰረታዊ በጎ ፈቃድነት ስልጠና አያስፈልግም። ጉዳዮች ከእርስዎ መስፈርት ጋር ሲዛመዱ ወዲያውኑ ማስጠንቀቂያዎችን መቀበል ይጀምራሉ። እያንዳንዱ የፍለጋ ምደባ ካርታ፣ መግለጫ እና ቀላል የሪፖርት ማድረጊያ አዝራሮችን ያካትታል።'
                )}</p>
                <div className="mt-3">
                  <Link to="/register" className="text-sm text-gray-700 font-medium hover:underline">
                    {t('Register as Volunteer →', 'እንደ በጎ ፈቃደኛ ይመዝገቡ →')}
                  </Link>
                </div>
              </InfoCard>

              <InfoCard icon={Star} title="Become a Coordinator" titleAm="አስተባባሪ ይሁኑ">
                <p>{t(
                  'Coordinators review cases, verify information, and manage volunteer assignments. Requirements: at least 10 successful volunteer searches, completion of coordinator training, and administrator approval. Coordinators have access to the dashboard for managing cases, merging duplicates, and communicating with families.',
                  'አስተባባሪዎች ጉዳዮችን ይገመግማሉ፣ መረጃን ያረጋግጣሉ እና የበጎ ፈቃደኞችን ምደባ ያስተዳድራሉ። መስፈርቶች፡ ቢያንስ 10 የተሳኩ የበጎ ፈቃደኛ ፍለጋዎች፣ የአስተባባሪ ስልጠና ማጠናቀቅ እና የአስተዳዳሪ ፍቃድ። አስተባባሪዎች ጉዳዮችን ለማስተዳደር፣ ተመሳሳይ ጉዳዮችን ለማዋሃድ እና ከቤተሰቦች ጋር ለመገናኘት የዳሽቦርዱን መዳረሻ አላቸው።'
                )}</p>
              </InfoCard>

              <InfoCard icon={Globe} title="Spread Awareness" titleAm="ግንዛቤን ያስፋፉ">
                <p>{t(
                  'Even if you can\'t volunteer directly, you can help by: sharing active cases on your social media, telling your community about Reunite, following our Telegram channel for updates, or donating to support the platform. Every share increases the chance of someone recognizing a missing person.',
                  'በቀጥታ በጎ ፈቃደኛ መሆን ባይችሉም እንኳ ማገዝ ይችላሉ፡ ንቁ ጉዳዮችን በማህበራዊ ሚዲያዎ ማካፈል፣ ስለ Reunite ለማህበረሰብዎ መንገር፣ ለዝመናዎች የቴሌግራም ቻናላችንን መከተል ወይም መድረኩን ለመደገፍ መለገስ። እያንዳንዱ ማጋራት አንድ ሰው የጎደለን ሰው የማወቅ እድልን ይጨምራል።'
                )}</p>
              </InfoCard>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row">
        <div className="md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 md:min-h-screen p-4 md:p-6">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-left text-sm whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{section.label}</span>
              </button>
            ))}
          </nav>
          <div className="hidden md:block mt-6 pt-6 border-t border-gray-100">
            <Link to="/faq" className="text-xs text-black hover:text-gray-600">
              {t('View FAQ →', 'ተደጋጋሚ ጥያቄዎች →')}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ReadMorePage;
