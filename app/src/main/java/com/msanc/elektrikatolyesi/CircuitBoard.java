package com.msanc.elektrikatolyesi;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Shader;
import android.view.MotionEvent;
import android.view.View;
import java.util.HashSet;
import java.util.Set;

/** Touch-driven educational circuit puzzles. Coordinates are normalized to the board. */
public final class CircuitBoard extends View {
    public interface Listener { void changed(String message, boolean completed); }
    private static final int WHITE=0xFFE8F2FF, CYAN=0xFF38E1C0, ORANGE=0xFFFFB547, DIM=0xFF68829F;
    private final Paint p=new Paint(3);
    private final boolean panel;
    private final Set<String> wires=new HashSet<>();
    private Listener listener;
    private int selected=-1;
    private float dragX,dragY;
    private boolean switchClosed=false, startPressed=false, stopClosed=true, coil=false;
    private long started=System.currentTimeMillis();
    private final float[][] lampPoints={{.14f,.32f},{.39f,.24f},{.61f,.24f},{.84f,.35f},{.84f,.68f},{.14f,.68f}};
    private final float[][] panelPoints={{.11f,.22f},{.34f,.22f},{.49f,.22f},{.68f,.22f},{.83f,.22f},{.82f,.69f},{.65f,.69f},{.11f,.69f},{.34f,.45f},{.49f,.45f}};
    private final String[] lampNames={"+", "S1", "S2", "L1", "L2", "−"};
    private final String[] panelNames={"L", "11", "12", "13", "14", "A1", "A2", "N", "53", "54"};
    public CircuitBoard(Context context, boolean panel){super(context);this.panel=panel;setLayerType(View.LAYER_TYPE_SOFTWARE,null);setContentDescription(panel?"Kontaktör kumanda panosu":"Pil, anahtar ve ampul devresi");}
    public void setListener(Listener listener){this.listener=listener;notifyState();}
    private float dp(float x){return getResources().getDisplayMetrics().density*x;}
    private String key(int a,int b){return Math.min(a,b)+":"+Math.max(a,b);}
    private boolean has(int a,int b){return wires.contains(key(a,b));}
    private float[][] points(){return panel?panelPoints:lampPoints;}
    private float px(int i){return points()[i][0]*getWidth();}
    private float py(int i){return points()[i][1]*getHeight();}
    private void style(int color,float stroke){p.reset();p.setAntiAlias(true);p.setColor(color);p.setStrokeWidth(dp(stroke));p.setStrokeCap(Paint.Cap.ROUND);p.setStrokeJoin(Paint.Join.ROUND);}
    private void line(Canvas c,float x1,float y1,float x2,float y2,int color,float width){style(color,width);c.drawLine(x1,y1,x2,y2,p);}
    private void text(Canvas c,String s,float x,float y,int color,int size,boolean bold){style(color,1);p.setTextSize(dp(size));p.setTypeface(bold?android.graphics.Typeface.create("sans-serif",1):android.graphics.Typeface.create("sans-serif",0));p.setTextAlign(Paint.Align.CENTER);c.drawText(s,x,y,p);}
    private void box(Canvas c,float l,float t,float r,float b,int color,int radius){style(color,1);c.drawRoundRect(new RectF(l,t,r,b),dp(radius),dp(radius),p);}
    @Override protected void onDraw(Canvas c){super.onDraw(c);float w=getWidth(),h=getHeight();
        style(0xFF102942,1);p.setShader(new LinearGradient(0,0,w,h,0xFF132F4D,0xFF071B31,Shader.TileMode.CLAMP));c.drawRoundRect(new RectF(0,0,w,h),dp(22),dp(22),p);p.setShader(null);
        style(0x1638E1C0,1);for(int i=1;i<10;i++){float x=w*i/10;c.drawLine(x,0,x,h,p);}for(int j=1;j<12;j++){float y=h*j/12;c.drawLine(0,y,w,y,p);}
        text(c,panel?"KUMANDA DEVRESİ  •  24 V SİMÜLASYON":"DC DEVRE  •  9 V SİMÜLASYON",w/2,dp(27),CYAN,11,true);
        if(panel)drawPanel(c,w,h);else drawLamp(c,w,h);
        drawWires(c);drawTerminals(c);
        if(selected>=0){line(c,px(selected),py(selected),dragX,dragY,ORANGE,3);}
        text(c,"Uçtan uca sürükle  ·  elemanlara dokun",w/2,h-dp(18),DIM,11,false);
        if(energized())postInvalidateDelayed(48);
    }
    private void drawLamp(Canvas c,float w,float h){
        float bx=px(0),by=(py(0)+py(5))/2;box(c,bx-dp(32),by-dp(43),bx+dp(32),by+dp(43),0xFF25466A,15);
        line(c,bx-dp(13),by-dp(17),bx+dp(13),by-dp(17),ORANGE,4);line(c,bx-dp(8),by+dp(16),bx+dp(8),by+dp(16),WHITE,3);text(c,"9 V",bx,by+dp(4),WHITE,13,true);
        float sx=(px(1)+px(2))/2,sy=py(1);box(c,sx-dp(26),sy-dp(26),sx+dp(26),sy+dp(26),0xFF25466A,12);
        line(c,sx-dp(13),sy+dp(8),sx+dp(11),sy+(switchClosed?dp(8):-dp(11)),switchClosed?CYAN:ORANGE,4);
        text(c,"ANAHTAR",sx,sy+dp(48),WHITE,11,true);
        float lx=px(3),ly=(py(3)+py(4))/2;
        if(energized()){style(0x66FFB547,1);p.setShadowLayer(dp(30),0,0,ORANGE);c.drawCircle(lx,ly,dp(39),p);p.clearShadowLayer();}
        style(energized()?ORANGE:0xFF809BB5,3);p.setStyle(Paint.Style.STROKE);c.drawCircle(lx,ly,dp(29),p);p.setStyle(Paint.Style.FILL);
        line(c,lx-dp(13),ly-dp(9),lx+dp(13),ly+dp(9),energized()?ORANGE:WHITE,2);line(c,lx+dp(13),ly-dp(9),lx-dp(13),ly+dp(9),energized()?ORANGE:WHITE,2);
        text(c,"AMPUL",lx-dp(57),ly+dp(5),WHITE,11,true);
    }
    private void drawPanel(Canvas c,float w,float h){
        box(c,dp(10),dp(42),w-dp(10),h-dp(50),0xFF1C3652,16);
        drawRail(c,px(0),py(0),"L",ORANGE);drawRail(c,px(7),py(7),"N",CYAN);
        drawContact(c,1,2,"STOP",stopClosed,0xFFFF6882);
        drawContact(c,3,4,"START",startPressed,ORANGE);
        drawContact(c,8,9,"YARDIMCI",coil,CYAN);
        float cx=(px(5)+px(6))/2,cy=py(5);box(c,cx-dp(40),cy-dp(27),cx+dp(40),cy+dp(27),coil?0xFF186A67:0xFF304A68,13);
        text(c,"KM",cx,cy+dp(4),coil?CYAN:WHITE,11,true);text(c,"KM1 BOBİN",cx,cy+dp(50),WHITE,11,true);
        float mx=w*.49f,my=h*.84f;style(coil?CYAN:DIM,3);p.setStyle(Paint.Style.STROKE);c.drawCircle(mx,my,dp(20),p);p.setStyle(Paint.Style.FILL);text(c,"M",mx,my+dp(5),coil?CYAN:WHITE,15,true);
        if(coil){style(CYAN,2);c.save();c.rotate((System.currentTimeMillis()-started)%360,mx,my);for(int i=0;i<4;i++){c.drawLine(mx,my-dp(29),mx,my-dp(39),p);c.rotate(90,mx,my);}c.restore();}
        text(c,"MOTOR",mx,my+dp(43),WHITE,10,true);
    }
    private void drawRail(Canvas c,float x,float y,String name,int color){style(color,1);c.drawCircle(x,y,dp(21),p);text(c,name,x,y+dp(5),0xFF0D2138,16,true);}
    private void drawContact(Canvas c,int a,int b,String name,boolean closed,int active){float x=(px(a)+px(b))/2,y=py(a);box(c,x-dp(23),y-dp(22),x+dp(23),y+dp(22),closed?0xFF1B6868:0xFF354C68,10);line(c,x-dp(13),y+dp(5),x+dp(12),y+(closed?dp(5):-dp(9)),closed?CYAN:active,3);text(c,name,x,y+dp(43),WHITE,10,true);}
    private void drawWires(Canvas c){for(String k:wires){String[] halves=k.split(":");int a=Integer.parseInt(halves[0]),b=Integer.parseInt(halves[1]);boolean on=energized();line(c,px(a),py(a),px(b),py(b),on?CYAN:ORANGE,4);if(on){float phase=((System.currentTimeMillis()-started)%1100)/1100f;for(int d=0;d<3;d++){float f=(phase+d/3f)%1;style(WHITE,1);c.drawCircle(px(a)+(px(b)-px(a))*f,py(a)+(py(b)-py(a))*f,dp(3),p);}}}}
    private void drawTerminals(Canvas c){String[] names=panel?panelNames:lampNames;for(int i=0;i<points().length;i++){float x=px(i),y=py(i);style(i==selected?ORANGE:0xFF0D253F,1);c.drawCircle(x,y,dp(12),p);style(i==selected?ORANGE:WHITE,2);p.setStyle(Paint.Style.STROKE);c.drawCircle(x,y,dp(12),p);p.setStyle(Paint.Style.FILL);text(c,names[i],x,y-dp(18),WHITE,10,true);}}
    private int terminal(float x,float y){int hit=-1;float best=dp(22)*dp(22);for(int i=0;i<points().length;i++){float dx=x-px(i),dy=y-py(i),dist=dx*dx+dy*dy;if(dist<best){best=dist;hit=i;}}return hit;}
    private boolean near(float x,float y,int a,int b){float cx=(px(a)+px(b))/2,cy=py(a);return Math.abs(x-cx)<dp(30)&&Math.abs(y-cy)<dp(28);}
    @Override public boolean onTouchEvent(MotionEvent event){float x=event.getX(),y=event.getY();switch(event.getActionMasked()){
        case MotionEvent.ACTION_DOWN:
            if(getParent()!=null)getParent().requestDisallowInterceptTouchEvent(true);
            int hit=terminal(x,y);if(hit>=0){selected=hit;dragX=x;dragY=y;invalidate();return true;}
            if(panel){if(near(x,y,1,2)){stopClosed=!stopClosed;if(!stopClosed)coil=false;notifyState();return true;}if(near(x,y,3,4)){startPressed=!startPressed;notifyState();return true;}}
            else if(near(x,y,1,2)){switchClosed=!switchClosed;notifyState();return true;}
            return true;
        case MotionEvent.ACTION_MOVE:if(selected>=0){dragX=x;dragY=y;invalidate();}return true;
        case MotionEvent.ACTION_UP:if(selected>=0){int end=terminal(x,y);if(end>=0&&end!=selected){String wire=key(selected,end);if(!wires.add(wire))wires.remove(wire);selected=-1;notifyState();}else{selected=-1;invalidate();}}if(getParent()!=null)getParent().requestDisallowInterceptTouchEvent(false);return true;
        case MotionEvent.ACTION_CANCEL:selected=-1;invalidate();if(getParent()!=null)getParent().requestDisallowInterceptTouchEvent(false);return true;
        default:return true;
    }}
    public void reset(){wires.clear();selected=-1;switchClosed=false;startPressed=false;stopClosed=true;coil=false;notifyState();}
    public int wireCount(){return wires.size();}
    private boolean connected(int start,int end,boolean includeLoad){boolean[] visited=new boolean[points().length];int[] q=new int[points().length];int head=0,tail=0;q[tail++]=start;visited[start]=true;while(head<tail){int v=q[head++];if(v==end)return true;for(int n=0;n<visited.length;n++){boolean link=has(v,n);if(panel){link|=pair(v,n,1,2)&&stopClosed;link|=pair(v,n,3,4)&&startPressed;link|=pair(v,n,8,9)&&coil;link|=includeLoad&&pair(v,n,5,6);}else{link|=pair(v,n,1,2)&&switchClosed;link|=includeLoad&&pair(v,n,3,4);}if(link&&!visited[n]){visited[n]=true;q[tail++]=n;}}}return false;}
    private boolean pair(int v,int n,int a,int b){return (v==a&&n==b)||(v==b&&n==a);}
    private boolean energized(){return panel?coil:connected(0,5,true)&&!connected(0,5,false);}
    private boolean expected(){int[][] edges=panel?new int[][]{{0,1},{2,3},{4,5},{6,7},{2,8},{9,5}}:new int[][]{{0,1},{2,3},{4,5}};if(wires.size()!=edges.length)return false;for(int[] edge:edges)if(!has(edge[0],edge[1]))return false;return true;}
    private void notifyState(){if(panel){boolean direct=connected(0,7,false);boolean live=connected(0,7,true)&&!direct;coil=stopClosed&&live; // Re-evaluate with auxiliary contact after the coil changes.
            if(coil)coil=connected(0,7,true)&&!connected(0,7,false);
            if(listener!=null)listener.changed(direct?"Kısa bağlantı! Bobini by-pass eden hattı kaldır.":coil?(expected()?"KM1 çekti! Başlatmayı kapat; yardımcı kontak motoru tutmalı.":"Bobin çekti. Kilitleme bağlantılarını tamamla."):"Bağlantıları yap, STOP kapalıyken START'a dokun.",coil&&expected()&&!startPressed);
        }else if(listener!=null){boolean shorted=connected(0,5,false);listener.changed(shorted?"Kısa devre! Ampulü atlayan kabloyu kaldır.":energized()?(expected()?"Ampul yandı! Devreyi tamamladın.":"Ampul yandı; görev kablolarını kontrol et."):"Üç kabloyu sürükle, sonra anahtara dokun.",energized()&&expected());}invalidate();}
}
