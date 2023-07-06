// Importamos la librería AWS desde el módulo "aws-sdk"
import AWS from "aws-sdk";

// Importamos la función "nanoid" desde el módulo "nanoid"
import { nanoid } from "nanoid";

// Importamos el modelo "User" desde el archivo "../models/user"
import User from "../models/user";


// Configuración de AWS que contiene las credenciales y la región
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // ID de clave de acceso de AWS proporcionado en el entorno
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Clave de acceso secreta de AWS proporcionada en el entorno
    region: process.env.AWS_REGION, // Región de AWS proporcionada en el entorno
    apiVersion: process.env.AWS_API_VERSION, // Versión de la API de AWS proporcionada en el entorno
};

// Creación de una nueva instancia de AWS S3 utilizando la configuración previamente definida
const S3 = new AWS.S3(awsConfig);


const SES = new AWS.SES(awsConfig);

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de campos obligatorios
    if (!name) {
      return res.status(400).send("El nombre es obligatorio");
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("La contraseña es obligatoria y debe tener al menos 6 caracteres");
    }

    // Verificar si el correo electrónico ya está en uso
    const userExist = await User.findOne({ email }).exec(); // NOSONAR
    if (userExist) {
      return res.status(400).send("El correo electrónico ya está en uso");
    }

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(password);

    // Registrar el usuario en la base de datos
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Inténtalo de nuevo.");
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Comprobar si existe un usuario con el correo electrónico proporcionado en la base de datos
    const user = await User.findOne({ email }).exec(); // NOSONAR
    if (!user) {
      return res.status(400).send("Usuario no encontrado");
    }

    // Comprobar la contraseña
    const match = await comparePassword(password, user.password);
    if (!match) {
      console.log(match);
      return res.status(400).send("Contraseña incorrecta");
    }

    // Crear un JSON Web Token (JWT) firmado
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Excluir la contraseña encriptada del objeto de usuario
    user.password = undefined;

    // Enviar el token en una cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // solo funciona en HTTPS
    });

    // Enviar el usuario como respuesta JSON
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Inténtalo de nuevo.");
  }
};

// Función para cerrar sesión
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Cierre de sesión exitoso" });
  } catch (err) {
    console.log(err);
  }
};

// Función para obtener el usuario actual
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("USUARIO_ACTUAL", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

// Función para solicitar el restablecimiento de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();

    const user = await User.findOneAndUpdate({ email }, { passwordResetCode: shortCode }); // NOSONAR
    if (!user) {
      return res.status(400).send("Usuario no encontrado");
    }

    // Preparar los parámetros del correo electrónico
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <h1>Restablecer contraseña</h1>
                <p>Utiliza este código para restablecer tu contraseña</p>
                <h2 style="color:red;">${shortCode}</h2>
                <i>edemy.com</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Restablecer contraseña",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate({ email, passwordResetCode: code }, { password: hashedPassword, passwordResetCode: "" }).exec(); // NOSONAR
    console.log(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Inténtalo de nuevo.");
  }
};
