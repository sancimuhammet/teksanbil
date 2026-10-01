import com.msanc.elektrikatolyesi.Engineering;

public class EngineeringTest {
    static void near(double actual, double expected, double tolerance) {
        if (Math.abs(actual-expected)>tolerance) throw new AssertionError(actual+" != "+expected);
    }
    static void invalid(Runnable calculation) {
        try { calculation.run(); throw new AssertionError("Invalid input accepted"); }
        catch (IllegalArgumentException expected) { /* good */ }
    }
    public static void main(String[] args) {
        near(Engineering.current(10,400,.8,true),18.04,.02);
        near(Engineering.compensation(100,.75,.93),48.65,.1);
        near(Engineering.cableAmpacity(3,30,1),41,0.001);
        near(Engineering.cableAmpacity(3,40,2),41*.87*.85,0.001);
        near(Engineering.voltageDrop(20,20,2.5,230,1,false),3.297,.01);
        near(Engineering.minimumShortCircuitSection(10,.1,115),27.50,.01);
        near(Engineering.transformerNominalAmps(1000,400),1443.38,.02);
        near(Engineering.transformerApproxFaultKa(1000,400,6),24.056,.01);
        invalid(() -> Engineering.compensation(100,.95,.9));
        invalid(() -> Engineering.cableAmpacity(3,33,1));
        invalid(() -> Engineering.current(10,400,0,true));
        System.out.println("Engineering tests passed");
    }
}
