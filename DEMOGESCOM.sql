CREATE DATABASE GesComDemo;
GO

USE GesComDemo;
GO

CREATE SCHEMA AppData;
GO

---------------------------------------------------
-- FUNCIONES DE VALIDACION
---------------------------------------------------

---------------------------------
-- SOLO LETRAS Y ESPACIOS
---------------------------------

CREATE FUNCTION AppData.fnSoloTexto (@Texto NVARCHAR(200))
RETURNS BIT
AS
BEGIN

    IF @Texto IS NULL
        RETURN 1;

    IF @Texto LIKE '%[^A-Za-zÁÉÍÓÚáéíóúÑñ ]%'
        RETURN 0;

    RETURN 1;

END;
GO

---------------------------------
-- LETRAS Y NUMEROS
---------------------------------

CREATE FUNCTION AppData.fnTextoNumeros (@Texto NVARCHAR(200))
RETURNS BIT
AS
BEGIN

    IF @Texto IS NULL
        RETURN 1;

    IF @Texto LIKE '%[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]%'
        RETURN 0;

    RETURN 1;

END;
GO

---------------------------------
-- SOLO NUMEROS
---------------------------------

CREATE FUNCTION AppData.fnSoloNumeros (@Texto NVARCHAR(50))
RETURNS BIT
AS
BEGIN

    IF @Texto IS NULL
        RETURN 1;

    IF @Texto LIKE '%[^0-9]%'
        RETURN 0;

    RETURN 1;

END;
GO

---------------------------------
-- VALIDACION EMAIL
---------------------------------

CREATE FUNCTION AppData.fnEmailValido (@Email NVARCHAR(200))
RETURNS BIT
AS
BEGIN

    IF @Email IS NULL
        RETURN 1;

    IF @Email LIKE '%_@_%._%'
       AND LEN(@Email) - LEN(REPLACE(@Email, '@', '')) = 1
        RETURN 1;

    RETURN 0;

END;
GO

---------------------------------
-- VALIDACION CUIT ARGENTINO
---------------------------------

--CREATE FUNCTION AppData.fnCUITValido (@CUIT VARCHAR(11))
--RETURNS BIT
--AS
--BEGIN

  --  DECLARE @Suma INT = 0;
    --DECLARE @Digito INT;
   -- DECLARE @Resultado INT;

--    IF LEN(@CUIT) <> 11
  --      RETURN 0;

    --IF @CUIT LIKE '%[^0-9]%'
      --  RETURN 0;

 --   SET @Suma =
   --     (CAST(SUBSTRING(@CUIT,1,1) AS INT) * 5) +
   --     (CAST(SUBSTRING(@CUIT,2,1) AS INT) * 4) +
    --    (CAST(SUBSTRING(@CUIT,3,1) AS INT) * 3) +
    --    (CAST(SUBSTRING(@CUIT,4,1) AS INT) * 2) +
    --    (CAST(SUBSTRING(@CUIT,5,1) AS INT) * 7) +
    --    (CAST(SUBSTRING(@CUIT,6,1) AS INT) * 6) +
    --    (CAST(SUBSTRING(@CUIT,7,1) AS INT) * 5) +
    --    (CAST(SUBSTRING(@CUIT,8,1) AS INT) * 4) +
     --   (CAST(SUBSTRING(@CUIT,9,1) AS INT) * 3) +
     --   (CAST(SUBSTRING(@CUIT,10,1) AS INT) * 2);

--    SET @Resultado = 11 - (@Suma % 11);
--
--    IF @Resultado = 11
--        SET @Resultado = 0;
--
 --   IF @Resultado = 10
   --     SET @Resultado = 9;

  --  SET @Digito = CAST(SUBSTRING(@CUIT,11,1) AS INT);

--    IF @Resultado = @Digito
--        RETURN 1;

 --   RETURN 0;

--END;
--GO

---------------------------------------------------
-- PERMISOS
---------------------------------------------------

CREATE TABLE AppData.Permiso (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);
GO

INSERT INTO AppData.Permiso (Nombre)
VALUES
('Admin'),
('Usuario');
GO

---------------------------------------------------
-- USUARIOS
---------------------------------------------------

CREATE TABLE AppData.Usuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    Nombre NVARCHAR(50) NOT NULL UNIQUE,

    PasswordHash VARBINARY(64) NOT NULL,

    IdPermiso INT NOT NULL,

    Activo BIT DEFAULT 1,

    CONSTRAINT FK_Usuario_Permiso
        FOREIGN KEY (IdPermiso)
        REFERENCES AppData.Permiso(Id)
);
GO

---------------------------------------------------
-- CLIENTE
---------------------------------------------------

CREATE TABLE AppData.Cliente (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,

    Nombre NVARCHAR(50) NOT NULL,

    CUIT VARCHAR(11) NOT NULL UNIQUE,

    Localidad NVARCHAR(50),

    Calle NVARCHAR(100),

    Numero NVARCHAR(10),

    Activo BIT DEFAULT 1
);
GO

insert into AppData.Cliente (Nombre, CUIT, Localidad) values ('DENSO MANUFACTURING SA', '30685014420', 'Córdoba')

---------------------------------------------------
-- CHECKS CLIENTE
---------------------------------------------------

--ALTER TABLE AppData.Cliente
--ADD CONSTRAINT CHK_Cliente_CUIT
--CHECK (AppData.fnCUITValido(CUIT) = 1);
--GO

ALTER TABLE AppData.Cliente
ADD CONSTRAINT CHK_Cliente_Nombre
CHECK (AppData.fnTextoNumeros(Nombre) = 1);
GO

--ALTER TABLE AppData.Cliente
--ADD CONSTRAINT CHK_Cliente_Localidad
--CHECK (AppData.fnSoloTexto(Localidad) = 1);
--GO

--ALTER TABLE AppData.Cliente
--ADD CONSTRAINT CHK_Cliente_Calle
--CHECK (AppData.fnSoloTexto(Calle) = 1);
--GO

ALTER TABLE AppData.Cliente
ADD CONSTRAINT CHK_Cliente_Numero
CHECK (AppData.fnSoloNumeros(Numero) = 1);
GO

---------------------------------------------------
-- SOLICITANTE
---------------------------------------------------

CREATE TABLE AppData.Solicitante (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,

    Nombre NVARCHAR(100) NOT NULL,

    IdCliente BIGINT NOT NULL,

    Telefono NVARCHAR(30),

    Email NVARCHAR(50),

    Activo bit default 1

    CONSTRAINT FK_Solicitante_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES AppData.Cliente(Id)
);
GO


---------------------------------------------------
-- ESTADO COMERCIAL
---------------------------------------------------

CREATE TABLE AppData.EstadoComercial (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(20) NOT NULL
);
GO

INSERT INTO AppData.EstadoComercial (Nombre)
VALUES
('Emergencia'),
('Cotizada'),
('Adjudicada'),
('Facturada'),
('Cobrada');
GO

-- 1. Agregamos la columna como VARCHAR (puedes usar JSON si tu motor lo soporta)
ALTER TABLE AppData.EstadoComercial 
ADD sucesores NVARCHAR(50) NULL;
go


-- 2. Actualizamos los datos con tu lógica
UPDATE AppData.EstadoComercial SET sucesores = '4,5' WHERE Id = 1;
UPDATE AppData.EstadoComercial SET sucesores = '3,4,5' WHERE Id = 2;
UPDATE AppData.EstadoComercial SET sucesores = '4,5' WHERE Id = 3;
UPDATE AppData.EstadoComercial SET sucesores = '5' WHERE Id = 4;
UPDATE AppData.EstadoComercial SET sucesores = NULL WHERE Id = 5; -- O vacío ''

go

---------------------------------------------------
-- OBRA
---------------------------------------------------

CREATE TABLE AppData.Obra (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,

    IdCliente BIGINT NOT NULL,

    Descripcion NVARCHAR(300) NOT NULL,

    FechaAlta DATETIME DEFAULT GETDATE(),

    MontoPactado DECIMAL(18,2),

    IdSolicitante BIGINT,

    CONSTRAINT FK_Obra_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES AppData.Cliente(Id),

    CONSTRAINT FK_Obra_Solicitante
        FOREIGN KEY (IdSolicitante)
        REFERENCES AppData.Solicitante(Id)
);
GO

---------------------------------------------------
-- COTIZACION
---------------------------------------------------

CREATE TABLE AppData.Cotizacion (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,

    Prefijo INT NOT NULL,

    Numero INT NOT NULL,

    IdCliente BIGINT NOT NULL,

    IdObra BIGINT,

    IdSolicitante BIGINT,

    Referencia NVARCHAR(100) NOT NULL,

    Descripcion NVARCHAR(1000),

    Fecha DATETIME DEFAULT GETDATE(),

    Monto DECIMAL(18,2) NOT NULL,

    Formal BIT DEFAULT 1,

    CONSTRAINT FK_Cotizacion_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES AppData.Cliente(Id),

    CONSTRAINT FK_Cotizacion_Obra
        FOREIGN KEY (IdObra)
        REFERENCES AppData.Obra(Id),

    CONSTRAINT FK_Cotizacion_Solicitante
        FOREIGN KEY (IdSolicitante)
        REFERENCES AppData.Solicitante(Id)
);
GO

---------------------------------------------------
-- ORDEN DE COMPRA
---------------------------------------------------

CREATE TABLE AppData.OrdenDeCompra (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,

    Numero NVARCHAR(20) NOT NULL,

    IdCliente BIGINT NOT NULL,

    IdSolicitante BIGINT,

    IdObra BIGINT,

    IdCotizacion BIGINT,

    Fecha DATETIME DEFAULT GETDATE(),

    Monto DECIMAL(18,2),

    IVA DECIMAL(5,2) DEFAULT 21,

    CONSTRAINT FK_OC_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES AppData.Cliente(Id),

    CONSTRAINT FK_OC_Solicitante
        FOREIGN KEY (IdSolicitante)
        REFERENCES AppData.Solicitante(Id),

    CONSTRAINT FK_OC_Obra
        FOREIGN KEY (IdObra)
        REFERENCES AppData.Obra(Id),

    CONSTRAINT FK_OC_Cotizacion
        FOREIGN KEY (IdCotizacion)
        REFERENCES AppData.Cotizacion(Id)
);
GO

---------------------------------------------------
-- HISTORIAL ESTADO COMERCIAL
---------------------------------------------------

CREATE TABLE AppData.ObraEstadoComercial (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,

    IdObra BIGINT NOT NULL,

    IdEstadoComercial INT NOT NULL,

    Fecha DATETIME DEFAULT GETDATE(),

    Observaciones NVARCHAR(300),

    Activo BIT DEFAULT 1

    CONSTRAINT FK_OEC_Obra
        FOREIGN KEY (IdObra)
        REFERENCES AppData.Obra(Id),

    CONSTRAINT FK_OEC_Estado
        FOREIGN KEY (IdEstadoComercial)
        REFERENCES AppData.EstadoComercial(Id)
);
GO

---------------------------------------------------
-- TRIGGER VALIDACION CLIENTE
---------------------------------------------------

CREATE TRIGGER AppData.TR_ValidacionCliente
ON AppData.Cliente
INSTEAD OF INSERT, UPDATE
AS
BEGIN

    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE
            AppData.fnTextoNumeros(Nombre) = 0
           -- OR AppData.fnCUITValido(CUIT) = 0
           -- OR AppData.fnSoloTexto(Localidad) = 0
           -- OR AppData.fnSoloTexto(Calle) = 0
            OR AppData.fnSoloNumeros(Numero) = 0
    )
    BEGIN
        RAISERROR('Formato inválido',16,1);
        RETURN;
    END

    IF EXISTS(SELECT 1 FROM deleted)
    BEGIN
        UPDATE c
        SET
            Nombre = i.Nombre,
            CUIT = i.CUIT,
            Localidad = i.Localidad,
            Calle = i.Calle,
            Numero = i.Numero,
            Activo = i.Activo
        FROM AppData.Cliente c
        INNER JOIN inserted i
            ON c.Id = i.Id;
    END
    ELSE
    BEGIN
        INSERT INTO AppData.Cliente
        (
            Nombre,
            CUIT,
            Localidad,
            Calle,
            Numero,
            Activo
        )
        SELECT
            Nombre,
            CUIT,
            Localidad,
            Calle,
            Numero,
            Activo
        FROM inserted;
    END

END;
GO

---------------------------------------------------
-- TRIGGER VALIDACION SOLICITANTE
---------------------------------------------------

CREATE TRIGGER AppData.TR_ValidacionSolicitante
ON AppData.Solicitante
INSTEAD OF INSERT, UPDATE
AS
BEGIN

    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE
            AppData.fnEmailValido(Email) = 0
    )
    BEGIN
        RAISERROR('Formato inválido',16,1);
        RETURN;
    END

    IF EXISTS(SELECT 1 FROM deleted)
    BEGIN
        UPDATE s
        SET
            Nombre = i.Nombre,
            IdCliente = i.IdCliente,
            Telefono = i.Telefono,
            Email = i.Email
        FROM AppData.Solicitante s
        INNER JOIN inserted i
            ON s.Id = i.Id;
    END
    ELSE
    BEGIN
        INSERT INTO AppData.Solicitante
        (
            Nombre,
            IdCliente,
            Telefono,
            Email
        )
        SELECT
            Nombre,
            IdCliente,
            Telefono,
            Email
        FROM inserted;
    END

END;
GO

---------------------------------------------------
-- CREACION USUARIO ADMIN
---------------------------------------------------

INSERT INTO AppData.Usuario
(
    Nombre,
    PasswordHash,
    IdPermiso
)
VALUES
(
    'admin',
    HASHBYTES('SHA2_256', 'admin123'),
    1
);
GO

---------------------------------------------------
-- LOGIN
---------------------------------------------------

CREATE PROCEDURE AppData.spLogin
(
    @Usuario NVARCHAR(50),
    @Password NVARCHAR(200)
)
AS
BEGIN

    SET NOCOUNT ON;

    SELECT
        u.Id,
        u.Nombre,
        p.Nombre AS Permiso
    FROM AppData.Usuario u
    INNER JOIN AppData.Permiso p
        ON u.IdPermiso = p.Id
    WHERE
        u.Nombre = @Usuario
        AND u.PasswordHash = HASHBYTES('SHA2_256', @Password)
        AND u.Activo = 1;

END;
GO


---------------------------------------------------
-- ROLES
---------------------------------------------------

CREATE ROLE RolAdmin;
GO

CREATE ROLE RolUsuario;
GO


GRANT CONTROL ON SCHEMA::AppData TO RolAdmin;
GO

DENY SELECT, INSERT, UPDATE, DELETE
ON SCHEMA::AppData
TO RolUsuario;
GO


---------------------------------------------------
-- PROCEDURES
---------------------------------------------------

CREATE PROCEDURE AppData.spInsertarCliente
(
    @Nombre NVARCHAR(50),
    @CUIT VARCHAR(11),
    @Localidad NVARCHAR(50),
    @Calle NVARCHAR(100),
    @Numero NVARCHAR(10)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        INSERT INTO AppData.Cliente
        (
            Nombre,
            CUIT,
            Localidad,
            Calle,
            Numero
        )
        VALUES
        (
            @Nombre,
            @CUIT,
            @Localidad,
            @Calle,
            @Numero
        );

        SELECT
            1 AS Ok,
            'Cliente insertado correctamente' AS Mensaje;

    END TRY
    BEGIN CATCH

        SELECT
            0 AS Ok,
            ERROR_MESSAGE() AS Mensaje;

    END CATCH

END;
GO


CREATE PROCEDURE AppData.spListarCliente
AS
BEGIN

    SET NOCOUNT ON;

    SELECT
        Id,
        Nombre,
        CUIT,
        Localidad,
        Calle,
        Numero,
        Activo
    FROM AppData.Cliente
    WHERE Activo = 1

END;
GO


CREATE PROCEDURE AppData.spListarClienteId
@Id BIGINT
AS
BEGIN

    SET NOCOUNT ON;

    SELECT
        Id,
        Nombre,
        CUIT,
        Localidad,
        Calle,
        Numero,
        Activo
    FROM AppData.Cliente
    WHERE Id= @Id

END;
GO


CREATE PROCEDURE AppData.spModificarCliente
@Id BIGINT,
@Nombre NVARCHAR (50),
@CUIT NVARCHAR (11),
@Localidad NVARCHAR (50),
@Calle NVARCHAR (50),
@Numero NVARCHAR (10)
AS
BEGIN

SET NOCOUNT ON

BEGIN TRY 
    UPDATE AppData.Cliente
        SET Nombre = @Nombre,
            CUIT = @CUIT,
            Localidad = @Localidad,
            Calle = @Calle,
            Numero = @Numero

        WHERE Id = @Id
    
    SELECT 1 AS OK,
    'Cliente modificado correctamente' as MESSAGE

    END TRY
    BEGIN CATCH

    SELECT 0 AS ERROR,
    'Error al intentar modificar' as MESSAGE
    END CATCH

END
GO


CREATE PROCEDURE AppData.spEliminarCliente
@Id BIGINT
AS
BEGIN

SET NOCOUNT ON

BEGIN TRY 
    UPDATE AppData.Cliente
        SET Activo = 0

        WHERE Id = @Id
    
    SELECT 1 AS OK,
    'Cliente eliminado correctamente' as MESSAGE

    END TRY
    BEGIN CATCH

    SELECT 0 AS ERROR,
    'Error al intentar modificar' as MESSAGE
    END CATCH

END
GO




CREATE PROCEDURE AppData.spListarEstadoComercial
AS
BEGIN

    SET NOCOUNT ON

    SELECT
        Id,
        Nombre
    FROM AppData.EstadoComercial;

END
GO



CREATE PROCEDURE AppData.spListarSolicitante
AS
BEGIN

    SET NOCOUNT ON

    SELECT
        Id,
        Nombre,
        IdCliente,
        Telefono,
        Email
    FROM AppData.Solicitante
    WHERE Activo = 1

END
GO


CREATE PROCEDURE AppData.spListarSolicitanteId
@Id BIGINT
AS
BEGIN

    SELECT * FROM AppData.Solicitante
    WHERE Id = @id
    
END
GO



CREATE PROCEDURE AppData.spInsertarSolicitante
(
    @Nombre NVARCHAR (50),
    @IdCliente BIGINT,
    @Telefono NVARCHAR (15),
    @Email NVARCHAR (25)
)
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY

        INSERT INTO AppData.Solicitante
            (Nombre, IdCliente, Telefono, Email)
        VALUES
            (@Nombre, @IdCliente, @Telefono, @Email)

        SELECT
            1 AS Ok,
            'Solicitante insertado correctamente' AS Mensaje;

        END TRY
        BEGIN CATCH

            SELECT
                0 AS Ok,
                ERROR_MESSAGE() AS Mensaje;

        END CATCH
END
GO



CREATE PROCEDURE AppData.spModificarSolicitante
@Id BIGINT,
@Nombre NVARCHAR (100),
@IdCliente BIGINT,
@Telefono NVARCHAR (30),
@Email NVARCHAR (50)
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY 

        UPDATE AppData.Solicitante
        SET Nombre = @Nombre,
            IdCliente = @IdCliente,
            Telefono = @Telefono,
            Email = @Email
        WHERE Id = @Id

        SELECT 1 AS OK,
            'Solicitante actualizado correctamente' AS MENSAJE

        END TRY
        BEGIN CATCH

        SELECT
                0 AS Ok,
                ERROR_MESSAGE() AS Mensaje;

        END CATCH
END
GO


CREATE PROCEDURE AppData.spEliminarSolicitante
@Id BIGINT
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY 

        UPDATE AppData.Solicitante
        SET Activo = 0
        WHERE Id = @Id

        SELECT 1 AS OK,
            'Solicitante eliminado correctamente' AS MENSAJE

        END TRY
        BEGIN CATCH

        SELECT
                0 AS Ok,
                ERROR_MESSAGE() AS Mensaje;

        END CATCH
END
GO




CREATE PROCEDURE AppData.spInsertarObraEstadoComercial
@IdObra BIGINT,
@IdEstadoComercial INT,
@Observaciones NVARCHAR (300)
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY

    INSERT INTO AppData.ObraEstadoComercial
        (IdObra,
        IdEstadoComercial,
        Observaciones)
        VALUES
        (@IdObra,
        @IdEstadoComercial,
        @Observaciones)

    SELECT 1 AS OK,
        'Estado insertado correctamente' AS MESSAGE
    END TRY

    BEGIN CATCH

    SELECT 0 AS OK,
        'No se insertó el estado' AS MESSAGE
    END CATCH

END
GO


CREATE PROCEDURE AppData.spListarObraEstadoComercial
AS
BEGIN

SET NOCOUNT ON

SELECT OEC.Id AS Id,
        O.Id AS IdObra,
        EC.Id AS IdEstadoComercial,
        EC.Nombre AS NombreEstadoComercial,
        EC.sucesores AS Sucesores,
        OEC.Fecha AS Fecha,
        OEC.Observaciones AS Observaciones
    FROM AppData.ObraEstadoComercial as OEC
    INNER JOIN AppData.Obra as O ON OEC.IdObra = O.Id
    INNER JOIN AppData.EstadoComercial AS EC ON OEC.IdEstadoComercial = EC.Id

END
GO


CREATE PROCEDURE AppData.spListarObraEstadoComercialPorObra
@Id BIGINT
AS
BEGIN

SELECT
    OEC.Id,
    OEC.IdObra,
    OEC.IdEstadoComercial,
    EC.Nombre as NombreEstadoComercial,
    EC.Sucesores,
    OEC.Fecha,
    OEC.Observaciones,
    OEC.Activo
FROM AppData.ObraEstadoComercial OEC
INNER JOIN AppData.EstadoComercial EC
    ON OEC.IdEstadoComercial =
       EC.Id
WHERE OEC.IdObra = @Id

end
go


CREATE PROCEDURE AppData.spListarObraEstadoComercialPorEstadoComercial
@Id BIGINT
AS
BEGIN

SELECT * FROM AppData.ObraEstadoComercial
    WHERE IdEstadoComercial = @Id

END
GO






CREATE PROCEDURE AppData.spEliminarObraEstadoComercial
@Id BIGINT
AS
BEGIN 

SET NOCOUNT ON

    BEGIN TRY

    UPDATE AppData.ObraEstadoComercial
        SET Activo = 0

    SELECT 1 AS OK,
        'ESTADO ACTUALIZADO CORRECTAMENTE' AS MESSAGE
    END TRY

    BEGIN CATCH
    SELECT 0 AS OK,
        'NO SE ACTUALIZÓ EL ESTADO' AS MESSAGE
    END CATCH

END
GO


CREATE PROCEDURE AppData.spListarObra
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        O.Id AS Id,
        C.Id AS IdCliente,
        C.Nombre AS NombreCliente,
        O.Descripcion AS Descripcion,
        O.FechaAlta AS Fecha,
        O.MontoPactado AS Monto,
        O.IdSolicitante AS IdSolicitante,
        EC.Nombre AS EstadoComercial -- Aquí vendrá el último estado
    FROM AppData.Obra AS O
    
    -- 1. Traemos los datos del cliente
    LEFT JOIN AppData.Cliente AS C 
        ON O.IdCliente = C.Id
    
    -- 2. Subconsulta para obtener SOLO el último estado de cada obra
    LEFT JOIN (
        SELECT 
            IdObra, 
            IdEstadoComercial,
            ROW_NUMBER() OVER (PARTITION BY IdObra ORDER BY Id DESC) AS Fila
            -- Nota: Si tienes un campo Fecha en esta tabla, es mejor usar ORDER BY FechaAlta DESC
        FROM AppData.ObraEstadoComercial
    ) AS UltimoEstado 
        ON O.Id = UltimoEstado.IdObra AND UltimoEstado.Fila = 1 -- Filtramos para que solo traiga la última coincidencia

    -- 3. Buscamos el nombre del estado comercial basado en el ID obtenido arriba
    LEFT JOIN AppData.EstadoComercial AS EC 
        ON UltimoEstado.IdEstadoComercial = EC.Id;

END
GO


CREATE PROCEDURE AppData.spListarObraId
@Id BIGINT
AS
BEGIN

SELECT * FROM AppData.Obra
WHERE Id = @Id

END
GO


CREATE PROCEDURE AppData.spInsertarObra
    @IdCliente BIGINT,
    @Descripcion NVARCHAR(300),
    @MontoPactado DECIMAL(18,2),
    @IdSolicitante BIGINT,
    @IdEstadoComercial INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Declaramos la variable para guardar el ID de la obra recién creada
    DECLARE @IdObra BIGINT; 

    BEGIN TRY
        -- Iniciamos una transacción para asegurar que ambos INSERTS ocurran, o ninguno
        BEGIN TRANSACTION;

        -- 1. Insertamos la Obra
        INSERT INTO AppData.Obra
            (IdCliente, Descripcion, MontoPactado, IdSolicitante)
        VALUES
            (@IdCliente, @Descripcion, @MontoPactado, @IdSolicitante);

        -- 2. Capturamos el ID autogenerado de la Obra recién insertada
        SET @IdObra = SCOPE_IDENTITY();

        -- 3. Insertamos en la tabla relacional usando el ID capturado
        INSERT INTO AppData.ObraEstadoComercial
            (IdObra, IdEstadoComercial)
        VALUES
            (@IdObra, @IdEstadoComercial);

        -- Si todo salió bien, confirmamos los cambios en la base de datos
        COMMIT TRANSACTION;

        -- Devolvemos el mensaje de éxito (e incluimos el IdObra por si tu backend lo necesita)
        SELECT 1 AS OK,
               'OBRA CREADA CORRECTAMENTE' AS MESSAGE,
               @IdObra AS IdObra;

    END TRY
    BEGIN CATCH
        -- Si algo falló dentro del bloque TRY, deshacemos cualquier cambio incompleto
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Devolvemos el mensaje de error junto con el error real de SQL Server (opcional pero muy útil)
        SELECT 0 AS OK,
               'NO SE PUDO CREAR LA OBRA: ' + ERROR_MESSAGE() AS MESSAGE,
               0 AS IdObra;
    END CATCH
END



GO
CREATE PROCEDURE AppData.spModificarObra
@Id BIGINT,
@IdCliente BIGINT,
@Descripcion NVARCHAR(300),
@MontoPactado DECIMAL(18,2),
@IdSolicitante BIGINT
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY

    UPDATE AppData.Obra
    SET IdCliente = @IdCliente,
        Descripcion = @Descripcion,
        MontoPactado = @MontoPactado,
        IdSolicitante = @IdSolicitante

    SELECT 1 AS OK,
        'OBRA MODIFICADA CORRECTAMENTE' AS MESSAGE

    END TRY
    BEGIN CATCH
    SELECT 0 AS OK,
        'NO SE PUDO MODIFICAR LA OBRA'
    END CATCH

END
GO



CREATE PROCEDURE AppData.spListarOrdenDeCompra
AS
BEGIN

SET NOCOUNT ON

    SELECT * FROM AppData.OrdenDeCompra

END
GO



CREATE PROCEDURE AppData.spListarOrdenDeCompraId
@Id BIGINT
AS
BEGIN

SELECT * FROM AppData.OrdenDeCompra
WHERE Id = @Id

END
GO


CREATE PROCEDURE AppData.spInsertarOrdendeCompra
@Numero NVARCHAR(20),
@IdCliente BIGINT,
@IdSolicitante BIGINT,
@IdObra BIGINT,
@IdCotizacion BIGINT,
@Monto DECIMAL(18,2),
@IVA DECIMAL(5,2)
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY

    INSERT INTO AppData.OrdenDeCompra
        (Numero,
        IdCliente,
        IdSolicitante,
        IdObra,
        IdCotizacion,
        Monto,
        IVA)
        VALUES
        (@Numero,
        @IdCliente,
        @IdSolicitante,
        @IdObra,
        @IdCotizacion,
        @Monto,
        @IVA)

    SELECT 1 AS OK,
        'ORDEN DE COMPRA INSERTADA CORRECTAMENTE' AS MESSAGE
    END TRY
    BEGIN CATCH
    SELECT 0 AS OK,
        'ORDEN DE COMPRA NO SE PUDO INSERTAR' AS MESSAGE
    END CATCH

END
GO


CREATE PROCEDURE AppData.spModificarOrdendeCompra
@Id BIGINT,
@Numero NVARCHAR(20),
@IdCliente BIGINT,
@IdSolicitante BIGINT,
@IdObra BIGINT,
@IdCotizacion BIGINT,
@Monto DECIMAL(18,2),
@IVA DECIMAL(5,2)
AS
BEGIN

    SET NOCOUNT ON

    BEGIN TRY

    UPDATE AppData.OrdenDeCompra
    SET Numero = @Numero,
        IdCliente = @IdCliente,
        IdSolicitante = @IdSolicitante,
        IdObra = @IdObra,
        IdCotizacion = @IdCotizacion,
        Monto = @Monto,
        IVA = @IVA

    SELECT 1 AS OK,
        'ORDEN DE COMPRA MODIFICADA' AS MESSAGE
    END TRY
    BEGIN CATCH
    SELECT 0 AS OK,
        'ORDEN DE COMPRA NO SE MODIFICÓ' AS MESSAGE

    END CATCH

END
GO


CREATE PROCEDURE AppData.spInsertarCotizacion
(
    @Prefijo INT,
    @Numero INT,
    @IdCliente BIGINT,
    @IdObra BIGINT = NULL,
    @IdSolicitante BIGINT = NULL,
    @Referencia NVARCHAR(100),
    @Descripcion NVARCHAR(1000) = NULL,
    @Monto DECIMAL(18,2),
    @Formal BIT = 1
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO AppData.Cotizacion
    (
        Prefijo,
        Numero,
        IdCliente,
        IdObra,
        IdSolicitante,
        Referencia,
        Descripcion,
        Monto,
        Formal
    )
    VALUES
    (
        @Prefijo,
        @Numero,
        @IdCliente,
        @IdObra,
        @IdSolicitante,
        @Referencia,
        @Descripcion,
        @Monto,
        @Formal
    );

    SELECT SCOPE_IDENTITY() AS IdGenerado;
END
GO


CREATE PROCEDURE AppData.spListarCotizacionId
(
    @Id BIGINT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Prefijo,
        Numero,
        IdCliente,
        IdObra,
        IdSolicitante,
        Referencia,
        Descripcion,
        Fecha,
        Monto,
        Formal
    FROM AppData.Cotizacion
    WHERE Id = @Id;
END
GO


CREATE PROCEDURE AppData.spModificarCotizacion
(
    @Id INT,
    @Prefijo INT,
    @Numero INT,
    @IdCliente BIGINT,
    @IdObra BIGINT = NULL,
    @IdSolicitante BIGINT = NULL,
    @Referencia NVARCHAR(100),
    @Descripcion NVARCHAR(1000) = NULL,
    @Monto DECIMAL(18,2),
    @Formal BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE AppData.Cotizacion
    SET
        Prefijo = @Prefijo,
        Numero = @Numero,
        IdCliente = @IdCliente,
        IdObra = @IdObra,
        IdSolicitante = @IdSolicitante,
        Referencia = @Referencia,
        Descripcion = @Descripcion,
        Monto = @Monto,
        Formal = @Formal
    WHERE Id = @Id;
END
GO


CREATE PROCEDURE AppData.spEliminarCotizacion
(
    @Id BIGINT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM AppData.Cotizacion
    WHERE Id = @Id;
END
GO


CREATE PROCEDURE AppData.spListarCotizacion
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Prefijo,
        Numero,
        IdCliente,
        IdObra,
        IdSolicitante,
        Referencia,
        Descripcion,
        Fecha,
        Monto,
        Formal
    FROM AppData.Cotizacion
    ORDER BY Fecha DESC;
END
GO




---------------------------------------------------
-- LOGIN SQL SERVER
---------------------------------------------------

CREATE LOGIN usuario_app
WITH PASSWORD = 'Password123!';
GO

CREATE USER usuario_app
FOR LOGIN usuario_app;
GO

ALTER ROLE RolUsuario
ADD MEMBER usuario_app;
GO



---------------------------------------------------
-- PERMISOS A SPS
---------------------------------------------------

GRANT EXECUTE ON AppData.spLogin TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spInsertarCliente TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarCliente TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spModificarCliente TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarObra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spInsertarObra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spModificarObra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarEstadoComercial TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarObraEstadoComercial TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spInsertarObraEstadoComercial TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spEliminarObraEstadoComercial TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarCotizacion TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spInsertarCotizacion TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spModificarCotizacion TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarOrdendeCompra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spInsertarOrdendeCompra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spModificarOrdendeCompra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spListarSolicitante TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spInsertarSolicitante TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spModificarSolicitante TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarSolicitanteId TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarClienteId TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarObraId TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarObraEstadoComercialPorObra TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarObraEstadoComercialPorEstadoComercial TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarCotizacionId TO RolUsuario;
GO

GRANT EXECUTE ON AppData.splistarOrdenDeCompraId TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spEliminarCliente TO RolUsuario;
GO

GRANT EXECUTE ON AppData.spEliminarSolicitante TO RolUsuario;
GO





