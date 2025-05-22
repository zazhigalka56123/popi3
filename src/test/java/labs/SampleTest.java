package labs;

import labs.util.Validator;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SampleTest {
    @Test
    void helloTest() {
        assertEquals(2, 1 + 1);
    }

    @Test
    void validatorIsHit() {
        assertEquals(new Validator().isHit(0, 1, 0), false);
    }
}