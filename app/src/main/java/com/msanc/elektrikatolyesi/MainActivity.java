package com.msanc.elektrikatolyesi;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.view.WindowInsets;
import android.content.Intent;
import android.net.Uri;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.widget.*;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final int BG=0xFFF1F5F9, NAVY=0xFF0B2038, MUTED=0xFF60748B, BLUE=0xFF087F79, ORANGE=0xFF28D6B7;
    private LinearLayout root, page, nav;
    private SharedPreferences prefs;
    private int tab=0;
    private int screen=0,activeTrack=0;
    private final String[] tools={"Güç ve akım", "Kompanzasyon", "Kablo kapasitesi", "Gerilim düşümü", "Kısa devre kesiti", "Trafo ve Ik"};
    @Override public void onCreate(Bundle state) { super.onCreate(state); prefs=getSharedPreferences("progress",MODE_PRIVATE); getWindow().setStatusBarColor(NAVY); getWindow().setNavigationBarColor(NAVY); showHome(); }
    int dp(float v){return (int)(getResources().getDisplayMetrics().density*v+.5f);}
    GradientDrawable shape(int color,int radius){GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(radius));return d;}
    LinearLayout column(){LinearLayout l=new LinearLayout(this);l.setOrientation(1);return l;}
    TextView text(String s,int size,int color,boolean bold){TextView v=new TextView(this);v.setText(s);v.setTextSize(size);v.setTextColor(color);v.setLineSpacing(dp(2),1f);if(bold)v.setTypeface(Typeface.DEFAULT,Typeface.BOLD);return v;}
    void pad(View v,int a,int b,int c,int d){v.setPadding(dp(a),dp(b),dp(c),dp(d));}
    void gap(LinearLayout l,int height){View v=new View(this);l.addView(v,new LinearLayout.LayoutParams(1,dp(height)));}
    void label(LinearLayout l,String title,String body){l.addView(text(title,18,NAVY,true));gap(l,5);l.addView(text(body,14,MUTED,false));}
    LinearLayout card(LinearLayout parent){LinearLayout c=column();pad(c,18,18,18,18);c.setBackground(shape(Color.WHITE,20));c.setElevation(dp(2));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.bottomMargin=dp(12);parent.addView(c,p);return c;}
    void shell(String title,String subtitle){
        root=column();root.setBackgroundColor(NAVY);setContentView(root);
        root.setOnApplyWindowInsetsListener((view,insets)->{int top,bottom,left,right;if(Build.VERSION.SDK_INT>=30){android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars());top=bars.top;bottom=bars.bottom;left=bars.left;right=bars.right;}else{top=insets.getSystemWindowInsetTop();bottom=insets.getSystemWindowInsetBottom();left=insets.getSystemWindowInsetLeft();right=insets.getSystemWindowInsetRight();}view.setPadding(left,top,right,bottom);return insets;});root.requestApplyInsets();
        LinearLayout header=column();header.setBackgroundColor(NAVY);pad(header,22,13,22,18);root.addView(header);
        TextView brand=text("MSANC  /  ELEKTRİK ATÖLYESİ",11,ORANGE,true);header.addView(brand);gap(header,7);header.addView(text(title,26,Color.WHITE,true));
        if(subtitle!=null){gap(header,5);header.addView(text(subtitle,14,0xFFBDD0E6,false));}
        ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);scroll.setBackgroundColor(BG);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));page=column();pad(page,17,19,17,22);scroll.addView(page);
        nav=new LinearLayout(this);nav.setBackgroundColor(Color.WHITE);root.addView(nav);
        String[] tabs={"Atölye", "Konular", "Hesap", "Profil"};String[] icons={"⌂", "▦", "∑", "●"};
        for(int i=0;i<4;i++){final int k=i;TextView item=text(icons[i]+"\n"+tabs[i],12,i==tab?BLUE:MUTED,true);item.setGravity(Gravity.CENTER);pad(item,0,8,0,8);nav.addView(item,new LinearLayout.LayoutParams(0,dp(66),1));item.setOnClickListener(v->{tab=k;if(k==0)showHome();else if(k==1)showAtlas();else if(k==2)showTools();else showProfile();});}
    }
    void chip(LinearLayout l,String s){TextView t=text(s,13,BLUE,true);pad(t,11,7,11,7);t.setBackground(shape(0xFFE9F2FF,12));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-2,-2);p.topMargin=dp(12);l.addView(t,p);}
    void button(LinearLayout l,String title,Runnable action){TextView b=text(title,15,Color.WHITE,true);b.setGravity(Gravity.CENTER);pad(b,16,13,16,13);b.setBackground(shape(BLUE,13));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.topMargin=dp(13);l.addView(b,p);b.setOnClickListener(v->action.run());}
    void showHome(){tab=0;screen=0;shell("Elektriği kur. Çalıştır. Anla.","Kabloları bağla, sonucu ekranda gör");
        LinearLayout hero=card(page);hero.setBackground(shape(NAVY,22));hero.addView(text("⚡  BUGÜNÜN ATÖLYESİ",12,ORANGE,true));gap(hero,10);hero.addView(text("Devreyi hayata geçir.",25,Color.WHITE,true));gap(hero,8);hero.addView(text("Uçları birbirine sürükle, anahtarı aç ve ampulün yanışını izle. Sonra motor panosunu kur.",15,0xFFBDD2E6,false));button(hero,"Ampul atölyesini aç  ↗",()->showLab(false));
        page.addView(text("OYNA VE ÖĞREN",12,MUTED,true));gap(page,10);
        labCard("01  /  DC DEVRE","Ampulü yak","Pil • anahtar • ampul","Üç kabloyu bağlayıp yolu tamamla.",0xFFE3F6F0,()->showLab(false));
        labCard("02  /  KUMANDA","Motor panosunu kur","STOP • START • KM1","Yardımcı kontakla kendini tutan kumanda yap.",0xFFFFF0D9,()->showLab(true));
        page.addView(text("MÜHENDİSLİK HARİTASI",12,MUTED,true));gap(page,10);LinearLayout c=card(page);label(c,"15 teknik konu","Devrelerden güç elektroniğine; kompanzasyon, kablo, trafo, PLC ve şebeke.");button(c,"Konuları keşfet  →",this::showAtlas);
    }
    void labCard(String eyebrow,String title,String tags,String detail,int color,Runnable action){LinearLayout c=card(page);c.setBackground(shape(color,20));c.addView(text(eyebrow,11,BLUE,true));gap(c,9);c.addView(text(title,21,NAVY,true));gap(c,4);c.addView(text(tags,13,BLUE,true));gap(c,7);c.addView(text(detail,14,MUTED,false));button(c,"Devreyi aç  →",action);}
    void showLab(boolean panel){tab=0;screen=1;shell(panel?"Motor kumanda panosu":"Ampul devresi",panel?"KM1'i çek ve yardımcı kontakla kilitle":"Kapalı bir devre kur, ampulü yak");
        LinearLayout intro=card(page);label(intro,panel?"GÖREV 02  ·  MOTOR":"GÖREV 01  ·  IŞIK",panel?"L → STOP → START → A1, A2 → N. STOP çıkışından 53'e, 54'ten A1'e bağla. START'a dokun, ardından bırak.":"Pilin + ucunu S1'e, S2'yi L1'e, L2'yi pilin − ucuna bağla. Anahtara dokun.");
        CircuitBoard board=new CircuitBoard(this,panel);page.addView(board,new LinearLayout.LayoutParams(-1,dp(panel?440:410)));gap(page,14);
        LinearLayout feedback=card(page);TextView status=text("",16,NAVY,true);feedback.addView(status);gap(feedback,12);ProgressBar progressBar=new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);progressBar.setMax(panel?6:3);feedback.addView(progressBar,new LinearLayout.LayoutParams(-1,dp(7)));
        board.setListener((message,done)->{status.setText(message);progressBar.setProgress(Math.min(board.wireCount(),panel?6:3));if(done&&!prefs.getBoolean(panel?"lab_panel":"lab_lamp",false)){prefs.edit().putBoolean(panel?"lab_panel":"lab_lamp",true).apply();status.setText(message+"  •  Görev tamamlandı!");}});
        button(feedback,"Bağlantıları sıfırla",board::reset);LinearLayout tip=card(page);label(tip,"Nasıl oynanır?","Yuvarlak uçtan diğer uca parmağınla kablo sürükle. Yanlış kabloyu kaldırmak için aynı iki ucu tekrar birleştir. Anahtar ve butonlara dokunabilirsin.");
        button(page,panel?"Kumanda mantığını oku  →":"Devreyi öğren  →",()->showTopic(panel?5:0));
    }
    void showAtlas(){tab=1;screen=2;shell("Konular","Temelden mühendislik uygulamalarına");LinearLayout intro=card(page);label(intro,"Öğrenme haritası","15 alandan istediğini seç. Konuyu oku, atölyede dene, ilgili hesap aracını kullan.");
        for(int i=0;i<Atlas.ALL.length;i++){final int index=i;Atlas.Topic topic=Atlas.ALL[i];LinearLayout c=card(page);label(c,topic.icon+"  "+topic.title,topic.summary);chip(c,topic.level+"  →");c.setOnClickListener(v->showTopic(index));}
    }
    void showTopic(int index){tab=1;screen=3;Atlas.Topic topic=Atlas.ALL[index];shell(topic.title,topic.level+"  /  "+topic.summary);
        LinearLayout concept=card(page);concept.addView(text("KAVRA",12,BLUE,true));gap(concept,10);concept.addView(text(topic.concept,16,NAVY,false));
        LinearLayout formula=card(page);formula.setBackground(shape(0xFFE2F7F1,20));formula.addView(text("TEMEL BAĞINTI",12,BLUE,true));gap(formula,9);formula.addView(text(topic.formula,19,NAVY,true));
        LinearLayout scenario=card(page);scenario.addView(text("UYGULAMADA DÜŞÜN",12,BLUE,true));gap(scenario,9);scenario.addView(text(topic.scenario,15,NAVY,false));
        if(index==0)button(scenario,"Ampul atölyesi",()->showLab(false));if(index==5||index==11)button(scenario,"Pano atölyesi",()->showLab(true));
        if(topic.tool>=0)button(scenario,"Hesap aracını aç",()->showCalculator(topic.tool));if(topic.route>=0)button(scenario,"Kısa görevler",()->showTrack(topic.route));button(page,"← Konular",this::showAtlas);
    }
    void showTrack(int track){tab=1;screen=4;activeTrack=track;shell(Lessons.TRACKS[track],Lessons.DESCRIPTIONS[track]);for(int i=0;i<Lessons.ALL.length;i++){if(Lessons.ALL[i].track!=track)continue;final int index=i;LinearLayout c=card(page);label(c,(prefs.getBoolean("l"+i,false)?"✓  ":"○  ")+Lessons.ALL[i].title,Lessons.ALL[i].body);chip(c,prefs.getBoolean("l"+i,false)?"Tamamlandı":"Görevi aç →");c.setOnClickListener(v->showLesson(index));}button(page,"← Tüm rotalar",this::showHome);}
    void showLesson(int i){Lessons.Lesson l=Lessons.ALL[i];tab=1;screen=5;activeTrack=l.track;shell(l.title,Lessons.TRACKS[l.track]+"  •  Görev "+(i%4+1)+"/4");LinearLayout theory=card(page);label(theory,"Kısa ders",l.body);chip(theory,l.formula);
        LinearLayout quiz=card(page);label(quiz,"Şimdi sıra sende",l.question);gap(quiz,12);
        TextView feedback=text("",14,NAVY,false);final boolean[] answered={false};
        for(int j=0;j<3;j++){final int selected=j;TextView option=text("  "+(char)('A'+j)+"   "+l.option(j),16,NAVY,true);pad(option,13,13,10,13);option.setBackground(shape(0xFFF0F4F9,12));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.bottomMargin=dp(9);quiz.addView(option,p);option.setOnClickListener(v->{if(answered[0])return;if(selected==l.correct){answered[0]=true;option.setBackground(shape(0xFFD8F5E8,12));feedback.setText("Doğru! +10 XP\n"+l.explanation);prefs.edit().putBoolean("l"+i,true).apply();}else{option.setBackground(shape(0xFFFFE6E4,12));feedback.setText("Tekrar dene. İpucu: "+l.formula);}});}
        quiz.addView(feedback);button(page,"Sonraki göreve geç →",()->{if(i+1<Lessons.ALL.length && Lessons.ALL[i+1].track==l.track)showLesson(i+1);else showTrack(l.track);});
    }
    void showTools(){tab=2;screen=6;shell("Mühendislik araçları","Hesapla · varsayımları ve birimleri gör");for(int i=0;i<tools.length;i++){final int k=i;LinearLayout c=card(page);label(c,(i+1<10?"0":"")+(i+1)+"  "+tools[i],new String[]{"1φ / 3φ yük akımı", "Hedef cosφ için gereken kvar", "Cu/PVC · C yöntemi · 3 yüklü damar", "Cu kabloda yaklaşık yüzde düşüm", "Adyabatik S ≥ I√t/k", "Nominal akım ve trafo uçları Ik"}[i]);c.setOnClickListener(v->showCalculator(k));}}
    EditText field(LinearLayout l,String title,String value){l.addView(text(title,13,MUTED,true));EditText e=new EditText(this);e.setSingleLine(true);e.setText(value);e.setTextSize(18);e.setInputType(8194);e.setSelectAllOnFocus(true);e.setBackground(shape(0xFFF0F4F9,12));pad(e,12,9,12,9);LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.topMargin=dp(5);p.bottomMargin=dp(14);l.addView(e,p);return e;}
    Spinner selector(LinearLayout l,String title,String[] items){l.addView(text(title,13,MUTED,true));Spinner s=new Spinner(this);ArrayAdapter<String> adapter=new ArrayAdapter<>(this,android.R.layout.simple_spinner_dropdown_item,items);s.setAdapter(adapter);LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,dp(47));p.bottomMargin=dp(12);l.addView(s,p);return s;}
    double number(EditText e){String s=e.getText().toString().trim().replace(',','.');try{return Double.parseDouble(s);}catch(Exception ex){throw new IllegalArgumentException("Lütfen sayısal değerleri doldur.");}}
    String n(double x){return String.format(new Locale("tr","TR"),"%.2f",x);}
    void showCalculator(int type){tab=2;screen=7;shell(tools[type],"Örnek parametreleri düzenleyip hesaplayabilirsin");LinearLayout form=card(page);EditText[] f=new EditText[5];Spinner[] s=new Spinner[3];
        switch(type){
            case 0: f[0]=field(form,"Aktif güç (kW)","10");f[1]=field(form,"Gerilim (V)","400");f[2]=field(form,"cosφ","0,8");s[0]=selector(form,"Sistem",new String[]{"Üç faz · hat gerilimi","Tek faz · faz gerilimi"});break;
            case 1: f[0]=field(form,"Aktif güç P (kW)","100");f[1]=field(form,"Mevcut cosφ","0,75");f[2]=field(form,"Hedef cosφ","0,93");break;
            case 2: String[] sizes=new String[Engineering.SIZES.length];for(int i=0;i<sizes.length;i++)sizes[i]=Engineering.SIZES[i]+" mm²";s[0]=selector(form,"Bakır kesit",sizes);s[0].setSelection(3);String[] ts=new String[Engineering.TEMP_C.length];for(int i=0;i<ts.length;i++)ts[i]=(int)Engineering.TEMP_C[i]+" °C";s[1]=selector(form,"Ortam sıcaklığı",ts);s[1].setSelection(4);String[] gs=new String[9];for(int i=0;i<9;i++)gs[i]=(i+1)+" devre";s[2]=selector(form,"Duvar/kapalı tava üzerinde aynı katmanda temas eden devre",gs);break;
            case 3: f[0]=field(form,"Yük akımı (A)","20");f[1]=field(form,"Tek yön uzunluk (m)","20");f[2]=field(form,"Bakır kesit (mm²)","2,5");f[3]=field(form,"Sistem gerilimi (V)","230");f[4]=field(form,"cosφ","1");s[0]=selector(form,"Sistem",new String[]{"Tek faz","Dengeli üç faz"});break;
            case 4: f[0]=field(form,"Kısa devre akımı (kA)","10");f[1]=field(form,"Açma süresi (s)","0,1");s[0]=selector(form,"İletken / yalıtım · k",new String[]{"Cu/PVC · 115","Cu/XLPE · 143","Al/PVC · 76","Al/XLPE · 94"});break;
            case 5: f[0]=field(form,"Trafo gücü (kVA)","1000");f[1]=field(form,"Sekonder hat gerilimi (V)","400");f[2]=field(form,"uk (%)","6");break;
        }
        LinearLayout result=card(page);result.addView(text("Sonuç burada görünecek",18,NAVY,true));
        button(form,"Hesapla →",()->{try{double a,b,c,d,e;String output="";String note="";switch(type){
            case 0:a=number(f[0]);b=number(f[1]);c=number(f[2]);output=n(Engineering.current(a,b,c,s[0].getSelectedItemPosition()==0))+" A";note="I = P / ("+(s[0].getSelectedItemPosition()==0?"√3 × ":"")+"U × cosφ). Dengeli, sinüzoidal yük varsayımı.";break;
            case 1:a=number(f[0]);b=number(f[1]);c=number(f[2]);output=n(Engineering.compensation(a,b,c))+" kvar";note="Qc = P(tanφ1 − tanφ2). Kademe ve harmonik seçimi ayrıca yapılır.";break;
            case 2:int si=s[0].getSelectedItemPosition();double t=Engineering.TEMP_C[s[1].getSelectedItemPosition()];int g=s[2].getSelectedItemPosition()+1;output=n(Engineering.cableAmpacity(si,t,g))+" A";note="Iz' = "+Engineering.METHOD_C[si]+" × "+Engineering.TEMP_FACTOR[s[1].getSelectedItemPosition()]+" × "+Engineering.GROUP_FACTOR[g-1]+". Yalnız Cu/PVC, 70°C, 3 yüklü damar, yöntem C, havada. Nötr harmonikleri ve başka döşeme biçimleri kapsam dışı.";break;
            case 3:a=number(f[0]);b=number(f[1]);c=number(f[2]);d=number(f[3]);e=number(f[4]);double pct=Engineering.voltageDrop(a,b,c,d,e,s[0].getSelectedItemPosition()==1);output=n(pct)+" %  ·  "+n(pct*d/100)+" V";note="R=23,7/S Ω/km, X≈0,08 Ω/km; tek fazda 2I, dengeli üç fazda √3I. Kesit 50 mm² altı için X ihmal edilebilir; burada dahil edildi. İzin verilen sınır kullanım amacına göre doğrulanmalı.";break;
            case 4:a=number(f[0]);b=number(f[1]);double[] ks={115,143,76,94};output=n(Engineering.minimumShortCircuitSection(a,b,ks[s[0].getSelectedItemPosition()]))+" mm² en az";note="S ≥ I√t/k. Adyabatik yaklaşım; uygun standart kesit üstten seçilir. Termik, mekanik ve koruma koordinasyonu ayrıca incelenir.";break;
            default:a=number(f[0]);b=number(f[1]);c=number(f[2]);output=n(Engineering.transformerNominalAmps(a,b))+" A nominal\n"+n(Engineering.transformerApproxFaultKa(a,b,c))+" kA yaklaşık Ik";note="In=S/(√3U), Ik≈In×100/uk%. Yalnız trafo empedansına dayalı yaklaşık değer; üst şebeke, kablo ve arıza türü dahil değildir.";
        }result.removeAllViews();result.addView(text(output,24,BLUE,true));gap(result,10);result.addView(text(note,14,MUTED,false));}catch(IllegalArgumentException ex){result.removeAllViews();result.addView(text(ex.getMessage(),15,0xFFC54839,true));}});
        LinearLayout caution=card(page);label(caution,"Tasarım notu","Bunlar eğitim amaçlı ön hesaplardır. Sahada kullanılacak kablo, kondansatör ve koruma cihazı; gerçek tesisat koşulları, üretici verileri, ilgili standartlar ve yetkili mühendis kontrolüyle seçilir.");
    }
    void showProfile(){tab=3;screen=8;shell("Kaynak ve yöntem","Formüllerin dayandığı teknik çerçeve");String[][] sources={
        {"IEC 60364-5-52","Alçak gerilim tesisatında kablo seçimi, döşeme ve gerilim düşümü. Kablo tablosu B.52.4'ün Schneider Electric Electrical Installation Guide G20 aktarımından sınırlı örnek.","https://webstore.iec.ch/en/publication/103734"},
        {"Kablo akım taşıma","Yöntem C, 3 yüklü bakır/PVC, 30°C tablo değeri × G12 ortam × G16 gruplanma. Yalnız belirtilen koşullarda.","https://www.electrical-installation.org/enwiki/General_method_for_cable_sizing"},
        {"Kompanzasyon","Qc=P(tanφ1−tanφ2). Harmonik/rezo­nans ve otomatik kademe tasarımı ayrı değerlendirilir.","https://www.electrical-installation.org/enwiki/Theoretical_principles_to_improve_power_factor"},
        {"Gerilim düşümü ve koruma","İletken R, X ve faz sayısı; kısa devre termik dayanım formülleri. Besleme ve açma koşulları ayrıca doğrulanır.","https://www.electrical-installation.org/enwiki/Calculation_of_voltage_drop_in_steady_load_conditions"},
        {"Harmonikler","Kondansatör bankında rezonans ve nötr akımı önemli olabilir.","https://www.electrical-installation.org/enwiki/Risk_of_resonance_due_to_power-system_harmonics"}
    };for(String[] row:sources){LinearLayout c=card(page);label(c,row[0],row[1]);chip(c,row[2]);}LinearLayout about=card(page);label(about,"Sürüm 0.2","İki oynanabilir atölye, 15 konu, 24 kısa görev ve 6 hesap aracı. İlerleme cihazda saklanır. MSANC Studio.");}
    @Override public void onBackPressed(){if(screen==3)showAtlas();else if(screen==5)showTrack(activeTrack);else if(screen==7)showTools();else if(screen==4)showAtlas();else showHome();}
}
