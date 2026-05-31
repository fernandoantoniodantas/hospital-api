import { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import "antd/dist/reset.css";

const { Title, Text } = Typography;

function App() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  async function onFinish(values) {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        message.error("Usuário ou senha inválidos");
        return;
      }

      const data = await response.json();
      setToken(data.token);
      message.success("Login realizado com sucesso");
    } catch (error) {
      message.error("Erro ao conectar com a API Haskell");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card style={{ width: 380, borderRadius: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Hospital API</Title>
          <Text type="secondary">Acesso ao sistema hospitalar</Text>
        </div>

        <Form
          layout="vertical"
          initialValues={{
            email: "admin@hospital.com",
            senha: "123456",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "Informe o e-mail" }]}
          >
            <Input placeholder="admin@hospital.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[{ required: true, message: "Informe a senha" }]}
          >
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Entrar
          </Button>
        </Form>

        {token && (
          <div style={{ marginTop: 20 }}>
            <Text strong>Token recebido:</Text>
            <pre style={{ whiteSpace: "pre-wrap" }}>{token}</pre>
          </div>
        )}
      </Card>
    </div>
  );
}

export default App;