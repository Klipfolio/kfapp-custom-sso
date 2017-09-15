package klipfolio.saas.webui.sso;

import klipfolio.saas.utils.MyLogger;
import klipfolio.saas.webui.klipeditor.componentcore.InputControlTests;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;

import javax.crypto.Cipher;
import javax.crypto.CipherOutputStream;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by shooshmand on 2017-07-06.
 */
//This class generates a SSO token based on a given companyID and secret Key
class SSOTokenGenerator {
    private static Logger LOG = MyLogger.getMyLogger(InputControlTests.class.getSimpleName());
    private SecretKeySpec secretKeySpec;
    private Base64 base64 = new Base64();

    /*
    * Creates the SecretKeySpec (to be used in AES), based on the ID and ssoKey of the company
    * @param klipfolioCompanyId ID of the company
    * @param ssoKey the secret key of the company
    * */
    private void initializeSecretKeySpec(String klipfolioCompanyId, String ssoKey) {
        String salted = ssoKey + klipfolioCompanyId;
        byte[] hash = DigestUtils.sha(salted);
        byte[] saltedHash = new byte[16];
        System.arraycopy(hash, 0, saltedHash, 0, 16);

        secretKeySpec = new SecretKeySpec(saltedHash, "AES");
    }

    /**
    * Encrypt the given stream using AES
    * @param in : the input stream to be encrypted
    * @param out: the encrypted stream
    * */
    private void encrypt(InputStream in, OutputStream out) throws Exception {
        CipherOutputStream cipherOutputStream = null;

        try {
            byte[] buf = new byte[1024];

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

            out.write(cipher.getIV());

            cipherOutputStream = new CipherOutputStream(out, cipher);

            int numRead = 0;
            while ((numRead = in.read(buf)) >= 0) {
                cipherOutputStream.write(buf, 0, numRead);
            }

        } catch (Exception e) {
            LOG.info("An exception occurred during AES encryption : " + e.toString());
        }
        finally {
            if (cipherOutputStream != null)
                cipherOutputStream.close();
        }

    }

    /**
    * Encrypts the given JSON object (using AES)
    * @param json : the input json object
    * @return the encrypted json object as string
    * */
    private String create(JSONObject json) throws Exception {
        byte[] data = json.toString().getBytes("UTF-8");
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        encrypt(new ByteArrayInputStream(data), out);

        return new String(base64.encode(out.toByteArray()));
    }


    /**
     * @param  email the email of the company.
     * @param  klipfolioCompanyId the id of the company
     * @param  ssoKey  the sso secret key of the company
     * @return ssoKey generated SSO token; */
    public String createToken(String email, String klipfolioCompanyId, String ssoKey) throws Exception {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("email", email);
        initializeSecretKeySpec(klipfolioCompanyId,ssoKey);
        String token = create(jsonObj);
        return token;
    }
}
