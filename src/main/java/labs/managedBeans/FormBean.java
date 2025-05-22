package labs.managedBeans;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import labs.database.DatabaseManager;
import labs.model.Point;
import labs.util.Validator;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.Serializable;

@Named("formBean")
@ApplicationScoped
@Getter
@Setter
public class FormBean implements Serializable {
    double x;
    double y;
    double r;

    private String otherX;
    private String otherY;
    private String otherR;

    DatabaseManager dbManager;
    private static final Logger logger = LogManager.getLogger(FormBean.class);
    Validator validator;
    @Inject
    private TableResBean tableResBean;

    @PostConstruct
    public void init(){
        logger.info("formBean.init() started");
        x = 0;
        y = 0;
        r = 2;
        dbManager = DatabaseManager.getInstance();
        validator = new Validator();
        logger.info("formBean.init() successfully finished");
    }

    public void addPoint(float x, float y, float r){
        logger.info("formBean.addPoint() started");
        boolean isHit = validator.isHit(x, y, r);
        dbManager.insertPoint(new Point(x, y, r, isHit));
        tableResBean.updateResultList();
        logger.info("formBean.addPoint() successfully finished");
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public void setR(Double rr) {
        r = rr;
    }

    public String getOtherX() {
        return otherX;
    }
    public void setOtherX(String otherrX) {
        otherX = otherrX;
    }

    public String getOtherY() {
        return otherY;
    }
    public void setOtherY(String otherrY) {
        otherY = otherrY;
    }

    public String getOtherR() {
        return otherR;
    }
    public void setOtherR(String otherrR) {
        this.otherR = (otherrR);
    }
}
