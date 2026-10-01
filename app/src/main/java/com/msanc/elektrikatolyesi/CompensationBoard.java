package com.msanc.elektrikatolyesi;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Shader;
import android.view.MotionEvent;
import android.view.View;
import java.util.Locale;

/** Discrete capacitor-step exercise for a sinusoidal 100 kW inductive load. */
public final class CompensationBoard extends View {
    public interface Listener { void changed(double kvar,double powerFactor,boolean solved); }
    private static final int WHITE=0xFFE5F3FF,CYAN=0xFF28D6B7,AMBER=0xFFF6A637,DIM=0xFF879DB6;
    private final Paint p=new Paint(3);
    private final int[] stages={5,10,10,20,25};
    private final boolean[] enabled=new boolean[5];
    private Listener listener;
    private long time=System.currentTimeMillis();
    public CompensationBoard(Context c){super(c);setContentDescription("Kompanzasyon kademeleri ve güç üçgeni");}
    private float d(float v){return v*getResources().getDisplayMetrics().density;}
    private void ink(int color,float width){p.reset();p.setAntiAlias(true);p.setColor(color);p.setStrokeWidth(d(width));p.setStrokeCap(Paint.Cap.ROUND);}
    private void label(Canvas c,String s,float x,float y,int size,int color,boolean bold){ink(color,1);p.setTextAlign(Paint.Align.CENTER);p.setTextSize(d(size));p.setTypeface(android.graphics.Typeface.create("sans-serif",bold?1:0));c.drawText(s,x,y,p);}
    private void line(Canvas c,float x,float y,float xx,float yy,int color,float width){ink(color,width);c.drawLine(x,y,xx,yy,p);}
    private void panel(Canvas c,float l,float t,float r,float b,int color){ink(color,1);c.drawRoundRect(new RectF(l,t,r,b),d(13),d(13),p);}
    public double kvar(){int sum=0;for(int i=0;i<5;i++)if(enabled[i])sum+=stages[i];return sum;}
    private double q0(){return 100*Math.tan(Math.acos(.75));}
    public double pf(){double residual=q0()-kvar();return 100/Math.hypot(100,residual);}
    private boolean solved(){return pf()>=.92&&pf()<=.95&&kvar()<=q0();}
    private void report(){if(listener!=null)listener.changed(kvar(),pf(),solved());invalidate();}
    public void setListener(Listener listener){this.listener=listener;report();}
    public void reset(){for(int i=0;i<5;i++)enabled[i]=false;report();}
    @Override protected void onDraw(Canvas c){super.onDraw(c);float w=getWidth(),h=getHeight();ink(0xFF0B2038,1);p.setShader(new LinearGradient(0,0,w,h,0xFF173D58,0xFF0A2037,Shader.TileMode.CLAMP));c.drawRoundRect(new RectF(0,0,w,h),d(21),d(21),p);p.setShader(null);
        label(c,"100 kW   •   BAŞLANGIÇ cosφ 0,75",w/2,d(29),12,CYAN,true);
        float ox=w*.21f,oy=h*.41f;float dx=w*.51f;float dy=(float)(Math.max(0,q0()-kvar())/q0()*h*.24f);
        line(c,ox,oy,ox+dx,oy,DIM,3);line(c,ox+dx,oy,ox+dx,oy-dy,AMBER,3);line(c,ox,oy,ox+dx,oy-dy,CYAN,4);
        label(c,"P = 100 kW",ox+dx*.48f,oy+d(24),12,WHITE,true);label(c,"Q kalan",ox+dx+d(40),oy-dy/2,12,AMBER,true);
        label(c,String.format(new Locale("tr","TR"),"cosφ  %.3f",pf()),w/2,h*.52f,27,solved()?CYAN:WHITE,true);
        label(c,"KONDANSATÖR KADEMELERİ",w/2,h*.61f,11,DIM,true);
        for(int i=0;i<5;i++){float left=w*(.035f+i*.194f),right=left+w*.17f;float top=h*.65f,bottom=h*.81f;panel(c,left,top,right,bottom,enabled[i]?0xFF127A72:0xFF2C4662);label(c,stages[i]+"",(left+right)/2,top+d(31),17,WHITE,true);label(c,"kvar",(left+right)/2,top+d(49),11,enabled[i]?WHITE:DIM,false);}
        label(c,"Seçilen: "+(int)kvar()+" kvar",w/2,h*.89f,15,solved()?CYAN:AMBER,true);
        if(kvar()>0){float phase=((System.currentTimeMillis()-time)%1200)/1200f;float x=ox+dx*phase,y=oy-dy*phase;ink(CYAN,1);c.drawCircle(x,y,d(5),p);postInvalidateDelayed(48);}
    }
    @Override public boolean onTouchEvent(MotionEvent e){if(e.getActionMasked()==MotionEvent.ACTION_UP){float x=e.getX()/getWidth(),y=e.getY()/getHeight();if(y>.65f&&y<.81f){for(int i=0;i<5;i++){float left=.035f+i*.194f;if(x>=left&&x<=left+.17f){enabled[i]=!enabled[i];report();performClick();return true;}}}return true;}return true;}
    @Override public boolean performClick(){super.performClick();return true;}
}
