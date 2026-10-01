package com.msanc.elektrikatolyesi;

/** Sinusoidal steady-state, balanced AC assumptions unless a method says otherwise. */
public final class Engineering {
    private Engineering() {}
    public static final double SQRT3 = Math.sqrt(3.0);
    public static final double[] SIZES = {1.5,2.5,4,6,10,16,25,35,50,70,95,120,150,185};
    // IEC 60364-5-52 Table B.52.4 excerpt: Cu/PVC, 3 loaded cores, method C, air 30°C.
    public static final double[] METHOD_C = {17.5,24,32,41,57,76,96,119,144,184,223,259,299,341};
    public static final double[] TEMP_C = {10,15,20,25,30,35,40,45,50,55,60};
    public static final double[] TEMP_FACTOR = {1.22,1.17,1.12,1.06,1,0.94,0.87,0.79,0.71,0.61,0.50};
    // One layer on wall/floor/unperforated tray, touching, method C, G16.
    public static final double[] GROUP_FACTOR = {1,0.85,0.79,0.75,0.73,0.72,0.72,0.71,0.70};

    static void positive(double n, String what) {
        if (!Double.isFinite(n) || n <= 0) throw new IllegalArgumentException(what + " sıfırdan büyük olmalı.");
    }
    static void pf(double n) {
        if (!Double.isFinite(n) || n <= 0 || n > 1) throw new IllegalArgumentException("Güç katsayısı 0 ile 1 arasında olmalı.");
    }
    public static double current(double powerKw, double volts, double cos, boolean threePhase) {
        positive(powerKw,"Güç"); positive(volts,"Gerilim"); pf(cos);
        return powerKw * 1000 / ((threePhase ? SQRT3 : 1) * volts * cos);
    }
    public static double compensation(double powerKw, double initialPf, double targetPf) {
        positive(powerKw,"Aktif güç"); pf(initialPf); pf(targetPf);
        if (targetPf <= initialPf) throw new IllegalArgumentException("Hedef cosφ başlangıç değerinden büyük olmalı.");
        return powerKw * (Math.tan(Math.acos(initialPf)) - Math.tan(Math.acos(targetPf)));
    }
    public static int tempIndex(double celsius) {
        for (int i=0;i<TEMP_C.length;i++) if (TEMP_C[i] == celsius) return i;
        throw new IllegalArgumentException("Sıcaklık tablodan seçilmeli.");
    }
    public static double cableAmpacity(int sizeIndex, double celsius, int groupedCircuits) {
        if (sizeIndex < 0 || sizeIndex >= SIZES.length || groupedCircuits < 1 || groupedCircuits > 9)
            throw new IllegalArgumentException("Kesit veya devre sayısı desteklenmiyor.");
        return METHOD_C[sizeIndex] * TEMP_FACTOR[tempIndex(celsius)] * GROUP_FACTOR[groupedCircuits - 1];
    }
    public static double voltageDrop(double amps, double lengthM, double mm2, double volts, double cos, boolean threePhase) {
        positive(amps,"Akım"); positive(lengthM,"Uzunluk"); positive(mm2,"Kesit"); positive(volts,"Gerilim"); pf(cos);
        // Cu conductor at operating temperature, R = 23.7/S Ω/km; X ≈ 0.08 Ω/km.
        double r = 23.7 / mm2, x = 0.08;
        double drop = (threePhase ? SQRT3 : 2) * amps * (r*cos + x*Math.sqrt(1-cos*cos)) * lengthM/1000;
        return 100 * drop / volts;
    }
    public static double minimumShortCircuitSection(double faultKa, double seconds, double k) {
        positive(faultKa,"Kısa devre akımı"); positive(seconds,"Süre"); positive(k,"Malzeme katsayısı");
        return faultKa * 1000 * Math.sqrt(seconds) / k;
    }
    public static double transformerNominalAmps(double kva, double lineVolts) {
        positive(kva,"Trafo gücü"); positive(lineVolts,"Hat gerilimi");
        return kva * 1000 / (SQRT3 * lineVolts);
    }
    public static double transformerApproxFaultKa(double kva, double lineVolts, double ukPercent) {
        positive(ukPercent,"Kısa devre gerilimi");
        return transformerNominalAmps(kva,lineVolts) * 100 / ukPercent / 1000;
    }
}
