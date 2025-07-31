## API Documentation

### **Authentication**

#### **1. Register User**

- **Endpoint**: `POST /auth/register`
- **Description**: Mendaftarkan user baru.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Email is already registered"
    }
    ```

#### **2. Login User**

- **Endpoint**: `POST /auth/login`
- **Description**: Login user dan generate access token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login Success",
      "access_token": "string",
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

#### **3. Google Login**

- **Endpoint**: `POST /auth/login/google`
- **Description**: Login menggunakan Google OAuth.
- **Request Body**:
  ```json
  {
    "id_token": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Google Login Success",
      "access_token": "string",
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Invalid Google token"
    }
    ```

### **Users**

#### **1. Get All Users**

- **Endpoint**: `GET /users`
- **Description**: Mendapatkan semua data user (admin only).
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    ]
    ```

#### **2. Get User by ID**

- **Endpoint**: `GET /users/:id`
- **Description**: Mendapatkan detail user berdasarkan ID.
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "integer",
      "name": "string",
      "email": "string",
      "role": "string"
    }
    ```

#### **3. Delete User**

- **Endpoint**: `DELETE /users/:id`
- **Description**: Menghapus user berdasarkan ID (admin only).
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "User deleted successfully"
    }
    ```

### **Public**

#### **1. Get Public Courts**

- **Endpoint**: `GET /public/courts`
- **Description**: Mendapatkan semua lapangan untuk publik (tanpa autentikasi).
- **Query Parameters**:
  - `page`: Nomor halaman (default: 1)
  - `limit`: Jumlah data per halaman (default: 10)
  - `search`: Pencarian berdasarkan nama atau lokasi
  - `category`: Filter berdasarkan kategori
- **Response**:
  - **200 OK**:
    ```json
    {
      "courts": [
        {
          "id": "integer",
          "name": "string",
          "location": "string",
          "pricePerHour": "integer",
          "description": "string",
          "imageUrl": "string",
          "category": "string"
        }
      ],
      "pagination": {
        "page": "integer",
        "limit": "integer",
        "total": "integer",
        "totalPages": "integer"
      }
    }
    ```

#### **2. Get Public Court by ID**

- **Endpoint**: `GET /public/courts/:id`
- **Description**: Mendapatkan detail lapangan untuk publik.
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "integer",
      "name": "string",
      "location": "string",
      "pricePerHour": "integer",
      "description": "string",
      "imageUrl": "string",
      "category": "string"
    }
    ```

### **Courts**

#### **1. Get All Courts**

- **Endpoint**: `GET /courts`
- **Description**: Mendapatkan semua lapangan (dapat difilter berdasarkan kategori atau lokasi).
- **Query Parameters**:
  - `category`: Filter berdasarkan kategori.
  - `location`: Filter berdasarkan lokasi.
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "integer",
        "name": "string",
        "location": "string",
        "pricePerHour": "integer",
        "description": "string",
        "imageUrl": "string",
        "category": "string"
      }
    ]
    ```

#### **2. Get Court by ID**

- **Endpoint**: `GET /courts/:id`
- **Description**: Mendapatkan detail lapangan berdasarkan ID.
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "integer",
      "name": "string",
      "location": "string",
      "pricePerHour": "integer",
      "description": "string",
      "imageUrl": "string",
      "category": "string"
    }
    ```

#### **3. Create Court**

- **Endpoint**: `POST /courts`
- **Description**: Menambahkan lapangan baru (admin only).
- **Request Body**:
  ```json
  {
    "name": "string",
    "location": "string",
    "pricePerHour": "integer",
    "description": "string",
    "imageUrl": "string",
    "category": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Court created successfully"
    }
    ```

#### **4. Update Court**

- **Endpoint**: `PUT /courts/:id`
- **Description**: Mengedit lapangan berdasarkan ID (admin only).
- **Request Body**:
  ```json
  {
    "name": "string",
    "location": "string",
    "pricePerHour": "integer",
    "description": "string",
    "imageUrl": "string",
    "category": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Court updated successfully"
    }
    ```

#### **5. Delete Court**

- **Endpoint**: `DELETE /courts/:id`
- **Description**: Menghapus lapangan berdasarkan ID (admin only).
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Court deleted successfully"
    }
    ```

### **Bookings**

#### **1. Get All Bookings**

- **Endpoint**: `GET /bookings`
- **Description**: Mendapatkan semua booking milik user yang login.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "integer",
        "courtId": "integer",
        "date": "string",
        "timeStart": "string",
        "timeEnd": "string",
        "status": "string",
        "paymentUrl": "string"
      }
    ]
    ```

#### **2. Create Booking**

- **Endpoint**: `POST /bookings`
- **Description**: Membuat booking baru.
- **Request Body**:
  ```json
  {
    "courtId": "integer",
    "date": "string",
    "timeStart": "string",
    "timeEnd": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Booking created successfully",
      "booking": {
        "id": "integer",
        "courtId": "integer",
        "date": "string",
        "timeStart": "string",
        "timeEnd": "string",
        "status": "string",
        "paymentUrl": "string"
      }
    }
    ```

### **Webhook**

#### **1. Payment Webhook**

- **Endpoint**: `POST /payment/webhook`
- **Description**: Callback dari Midtrans untuk memperbarui status pembayaran.
- **Request Body**:
  ```json
  {
    "order_id": "string",
    "transaction_status": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Payment status updated"
    }
    ```
