import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Users, Sparkles, Target } from "lucide-react";

const About = () => {
  const { t, isRTL } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: isRTL ? 'الشغف والحب' : 'Passion & Love',
      description: isRTL 
        ? 'كل منتج في منصتنا مصنوع بحب وشغف من قلوب النساء المبدعات'
        : 'Every product on our platform is made with love and passion by creative women'
    },
    {
      icon: Users,
      title: isRTL ? 'المجتمع' : 'Community',
      description: isRTL 
        ? 'نبني جسور التواصل بين النساء المنتجات والمجتمع المحلي'
        : 'We build bridges connecting productive women with the local community'
    },
    {
      icon: Sparkles,
      title: isRTL ? 'الجودة' : 'Quality',
      description: isRTL 
        ? 'نضمن أعلى معايير الجودة في جميع المنتجات المعروضة'
        : 'We ensure the highest quality standards in all featured products'
    },
    {
      icon: Target,
      title: isRTL ? 'التمكين' : 'Empowerment',
      description: isRTL 
        ? 'نهدف إلى تمكين النساء اقتصادياً ودعم استقلاليتهن المالية'
        : 'We aim to empower women economically and support their financial independence'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${isRTL ? 'arabic-text' : ''}`}>
            {t('about.title')}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold text-primary ${isRTL ? 'arabic-text' : ''}`}>
              {t('about.title')}
            </h2>
            <p className={`text-lg leading-relaxed text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
              {t('about.story')}
            </p>
            <p className={`text-lg leading-relaxed text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
              {isRTL 
                ? 'نحن نؤمن بأن كل امرأة لديها موهبة وقدرة على الإبداع، ومن هنا جاءت فكرة إنشاء منصة تجمع بين النساء المبدعات والمجتمع، لتكون جسراً يربط بين الإنتاج المنزلي عالي الجودة والمستهلكين الذين يقدرون الصناعة اليدوية والطعام المحضر بحب.'
                : 'We believe that every woman has talent and the ability to create. This is where the idea of creating a platform that brings together creative women and the community came from, to be a bridge that connects high-quality home production with consumers who appreciate handmade crafts and food prepared with love.'
              }
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-soft-pink to-warm-beige rounded-2xl p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-4 ${isRTL ? 'arabic-text' : ''}`}>
                  {t('about.mission.title')}
                </h3>
                <p className={`text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                  {t('about.mission.text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-12 ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL ? 'قيمنا' : 'Our Values'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="category-card text-center hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className={`text-lg font-semibold mb-3 ${isRTL ? 'arabic-text' : ''}`}>
                      {value.title}
                    </h3>
                    <p className={`text-sm text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-cream to-soft-pink rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <p className={`text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                {isRTL ? 'امرأة منتجة' : 'Productive Women'}
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className={`text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                {isRTL ? 'منتج متاح' : 'Available Products'}
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <p className={`text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                {isRTL ? 'عميل راضي' : 'Satisfied Customers'}
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL ? 'انضمي إلى مجتمعنا' : 'Join Our Community'}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-3xl mx-auto mb-8 ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL 
              ? 'سواء كنت منتجة تريدين عرض منتجاتك أو مشترية تبحثين عن منتجات عالية الجودة، مطبخنا هو المكان المناسب لك. انضمي إلى مجتمعنا المتنامي من النساء الملهمات.'
              : 'Whether you are a producer wanting to showcase your products or a buyer looking for high-quality products, Our Kitchen is the right place for you. Join our growing community of inspiring women.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;