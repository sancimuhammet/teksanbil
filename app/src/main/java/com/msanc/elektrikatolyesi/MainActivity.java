package com.msanc.elektrikatolyesi;

import android.app.Activity;
import android.os.Bundle;
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
    private static final int BG=0xFFF4F7FB, NAVY=0xFF10243B, MUTED=0xFF66788E, BLUE=0xFF1767C2, ORANGE=0xFFFFA52E;
    private LinearLayout root, page, nav;
    private SharedPreferences prefs;
    private int tab=0;
    private final String[] tools={"Güç ve akım", "Kompanzasyon", "Kablo kapasitesi", "Gerilim düşümü", "Kısa devre kesiti", "Trafo ve Ik"};
    @Override public void onCreate(Bundle state) { super.onCreate(state); prefs=getSharedPreferences("progress",MODE_PRIVATE); getWindow().setStatusBarColor(NAVY); getWindow().setNavigationBarColor(NAVY); showHome(); }
    int dp(float v){return (int)(getResources().getDisplayMetrics().density*v+.5f);}
    GradientDrawable shape(int color,int radius){GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(radius));return d;}
    LinearLayout column(){LinearLayout l=new LinearLayout(this);l.setOrientation(1);return l;}
    TextView text(String s,int size,int color,boolean bold){TextView v=new TextView(this);v.setText(s);v.setTextSize(size);v.setTextColor(color);v.setLineSpacing(dp(2),1f);if(bold)v.setTypeface(Typeface.DEFAULT,Typeface.BOLD);return v;}
    void pad(View v,int a,int b,int c,int d){v.setPadding(dp(a),dp(b),dp(c),dp(d));}
    void gap(LinearLayout l,int height){View v=new View(this);l.addView(v,new LinearLayout.LayoutParams(1,dp(height)));}
    void label(LinearLayout l,String title,String body){l.addView(text(title,18,NAVY,true));gap(l,5);l.addView(text(body,14,MUTED,false));}
    LinearLayout card(LinearLayout parent){LinearLayout c=column();pad(c,18,18,18,18);c.setBackground(shape(Color.WHITE,20));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.bottomMargin=dp(12);parent.addView(c,p);return c;}
    void shell(String title,String subtitle){
        root=column();root.setBackgroundColor(BG);setContentView(root);
        LinearLayout header=column();header.setBackgroundColor(NAVY);pad(header,22,19,22,22);root.addView(header);
        TextView brand=text("MSANC STUDIO  /  ELEKTRİK ATÖLYESİ",11,ORANGE,true);header.addView(brand);gap(header,11);header.addView(text(title,28,Color.WHITE,true));
        if(subtitle!=null){gap(header,5);header.addView(text(subtitle,14,0xFFBDD0E6,false));}
        ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));page=column();pad(page,17,20,17,22);scroll.addView(page);
        nav=new LinearLayout(this);nav.setBackgroundColor(Color.WHITE);root.addView(nav);
        String[] tabs={"Öğren", "Hesapla", "Kaynak"};String[] icons={"◇", "∑", "☷"};
        for(int i=0;i<3;i++){final int k=i;TextView item=text(icons[i]+"\n"+tabs[i],13,i==tab?BLUE:MUTED,true);item.setGravity(Gravity.CENTER);pad(item,0,10,0,9);nav.addView(item,new LinearLayout.LayoutParams(0,dp(61),1));item.setOnClickListener(v->{tab=k;if(k==0)showHome();else if(k==1)showTools();else showSources();});}
    }
    void chip(LinearLayout l,String s){TextView t=text(s,13,BLUE,true);pad(t,11,7,11,7);t.setBackground(shape(0xFFE9F2FF,12));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-2,-2);p.topMargin=dp(12);l.addView(t,p);}
    void button(LinearLayout l,String title,Runnable action){TextView b=text(title,15,Color.WHITE,true);b.setGravity(Gravity.CENTER);pad(b,16,13,16,13);b.setBackground(shape(BLUE,13));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.topMargin=dp(13);l.addView(b,p);b.setOnClickListener(v->action.run());}
    void showHome(){tab=0;int done=0;for(int i=0;i<Lessons.ALL.length;i++)if(prefs.getBoolean("l"+i,false))done++;shell("Öğrenerek tasarla","Temelden mühendisliğe · "+Lessons.ALL.length+" etkileşimli görev");
        LinearLayout hero=card(page);hero.setBackground(shape(0xFFE9F2FF,20));label(hero,"İlerleme: "+done+" / "+Lessons.ALL.length,"Her doğru görev 10 XP kazandırır. Öğren, dene, yanıl ve yeniden çöz.");chip(hero,(done*10)+" XP  •  "+(done*100/Lessons.ALL.length)+"% tamamlandı");
        page.addView(text("ÖĞRENME ROTASI",12,MUTED,true));gap(page,10);
        for(int t=0;t<Lessons.TRACKS.length;t++){final int track=t;int completed=0;for(int i=0;i<Lessons.ALL.length;i++)if(Lessons.ALL[i].track==t && prefs.getBoolean("l"+i,false))completed++;LinearLayout c=card(page);label(c,Lessons.ICONS[t]+"  "+Lessons.TRACKS[t],Lessons.DESCRIPTIONS[t]);chip(c,completed+" / 4 görev");c.setOnClickListener(v->showTrack(track));}
    }
    void showTrack(int track){tab=0;shell(Lessons.TRACKS[track],Lessons.DESCRIPTIONS[track]);for(int i=0;i<Lessons.ALL.length;i++){if(Lessons.ALL[i].track!=track)continue;final int index=i;LinearLayout c=card(page);label(c,(prefs.getBoolean("l"+i,false)?"✓  ":"○  ")+Lessons.ALL[i].title,Lessons.ALL[i].body);chip(c,prefs.getBoolean("l"+i,false)?"Tamamlandı":"Görevi aç →");c.setOnClickListener(v->showLesson(index));}button(page,"← Tüm rotalar",this::showHome);}
    void showLesson(int i){Lessons.Lesson l=Lessons.ALL[i];tab=0;shell(l.title,Lessons.TRACKS[l.track]+"  •  Görev "+(i%4+1)+"/4");LinearLayout theory=card(page);label(theory,"Kısa ders",l.body);chip(theory,l.formula);
        LinearLayout quiz=card(page);label(quiz,"Şimdi sıra sende",l.question);gap(quiz,12);
        TextView feedback=text("",14,NAVY,false);final boolean[] answered={false};
        for(int j=0;j<3;j++){final int selected=j;TextView option=text("  "+(char)('A'+j)+"   "+l.option(j),16,NAVY,true);pad(option,13,13,10,13);option.setBackground(shape(0xFFF0F4F9,12));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.bottomMargin=dp(9);quiz.addView(option,p);option.setOnClickListener(v->{if(answered[0])return;if(selected==l.correct){answered[0]=true;option.setBackground(shape(0xFFD8F5E8,12));feedback.setText("Doğru! +10 XP\n"+l.explanation);prefs.edit().putBoolean("l"+i,true).apply();}else{option.setBackground(shape(0xFFFFE6E4,12));feedback.setText("Tekrar dene. İpucu: "+l.formula);}});}
        quiz.addView(feedback);button(page,"Sonraki göreve geç →",()->{if(i+1<Lessons.ALL.length && Lessons.ALL[i+1].track==l.track)showLesson(i+1);else showTrack(l.track);});
    }
    void showTools(){tab=1;shell("Mühendislik araçları","Hesapla · varsayımları ve birimleri gör");for(int i=0;i<tools.length;i++){final int k=i;LinearLayout c=card(page);label(c,(i+1<10?"0":"")+(i+1)+"  "+tools[i],new String[]{"1φ / 3φ yük akımı", "Hedef cosφ için gereken kvar", "Cu/PVC · C yöntemi · 3 yüklü damar", "Cu kabloda yaklaşık yüzde düşüm", "Adyabatik S ≥ I√t/k", "Nominal akım ve trafo uçları Ik"}[i]);c.setOnClickListener(v->showCalculator(k));}}
    EditText field(LinearLayout l,String title,String value){l.addView(text(title,13,MUTED,true));EditText e=new EditText(this);e.setSingleLine(true);e.setText(value);e.setTextSize(18);e.setInputType(8194);e.setSelectAllOnFocus(true);e.setBackground(shape(0xFFF0F4F9,12));pad(e,12,9,12,9);LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.topMargin=dp(5);p.bottomMargin=dp(14);l.addView(e,p);return e;}
    Spinner selector(LinearLayout l,String title,String[] items){l.addView(text(title,13,MUTED,true));Spinner s=new Spinner(this);ArrayAdapter<String> adapter=new ArrayAdapter<>(this,android.R.layout.simple_spinner_dropdown_item,items);s.setAdapter(adapter);LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,dp(47));p.bottomMargin=dp(12);l.addView(s,p);return s;}
    double number(EditText e){String s=e.getText().toString().trim().replace(',','.');try{return Double.parseDouble(s);}catch(Exception ex){throw new IllegalArgumentException("Lütfen sayısal değerleri doldur.");}}
    String n(double x){return String.format(new Locale("tr","TR"),"%.2f",x);}
    void showCalculator(int type){tab=1;shell(tools[type],"Örnek parametreleri düzenleyip hesaplayabilirsin");LinearLayout form=card(page);EditText[] f=new EditText[5];Spinner[] s=new Spinner[3];
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
    void showSources(){tab=2;shell("Kaynak ve yöntem","Formüllerin dayandığı teknik çerçeve");String[][] sources={
        {"IEC 60364-5-52","Alçak gerilim tesisatında kablo seçimi, döşeme ve gerilim düşümü. Kablo tablosu B.52.4'ün Schneider Electric Electrical Installation Guide G20 aktarımından sınırlı örnek.","https://webstore.iec.ch/en/publication/103734"},
        {"Kablo akım taşıma","Yöntem C, 3 yüklü bakır/PVC, 30°C tablo değeri × G12 ortam × G16 gruplanma. Yalnız belirtilen koşullarda.","https://www.electrical-installation.org/enwiki/General_method_for_cable_sizing"},
        {"Kompanzasyon","Qc=P(tanφ1−tanφ2). Harmonik/rezo­nans ve otomatik kademe tasarımı ayrı değerlendirilir.","https://www.electrical-installation.org/enwiki/Theoretical_principles_to_improve_power_factor"},
        {"Gerilim düşümü ve koruma","İletken R, X ve faz sayısı; kısa devre termik dayanım formülleri. Besleme ve açma koşulları ayrıca doğrulanır.","https://www.electrical-installation.org/enwiki/Calculation_of_voltage_drop_in_steady_load_conditions"},
        {"Harmonikler","Kondansatör bankında rezonans ve nötr akımı önemli olabilir.","https://www.electrical-installation.org/enwiki/Risk_of_resonance_due_to_power-system_harmonics"}
    };for(String[] row:sources){LinearLayout c=card(page);label(c,row[0],row[1]);chip(c,row[2]);}LinearLayout about=card(page);label(about,"Sürüm 0.1","Çevrimdışı çalışan 24 görev, 6 mühendislik hesaplayıcısı. İlerleme cihazda saklanır. MSANC Studio.");}
    @Override public void onBackPressed(){if(tab==1)showTools();else showHome();}
}
