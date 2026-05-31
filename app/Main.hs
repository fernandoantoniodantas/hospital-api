{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeOperators #-}

module Main where

import Data.Aeson
import Data.Text (Text)
import GHC.Generics
import Network.Wai.Handler.Warp (run)
import Servant

data LoginRequest = LoginRequest
  { email :: Text
  , senha :: Text
  }
  deriving (Generic, Show)

instance FromJSON LoginRequest

data LoginResponse = LoginResponse
  { token :: Text
  }
  deriving (Generic, Show)

instance ToJSON LoginResponse

data Paciente = Paciente
  { nome :: Text
  , cpf :: Text
  }
  deriving (Generic, Show)

instance ToJSON Paciente

type API =
       "login" :> ReqBody '[JSON] LoginRequest :> Post '[JSON] LoginResponse
  :<|> "pacientes" :> Get '[JSON] [Paciente]

server :: Server API
server =
       loginHandler
  :<|> pacientesHandler

loginHandler :: LoginRequest -> Handler LoginResponse
loginHandler req =
  if email req == "admin@hospital.com" && senha req == "123456"
    then return $ LoginResponse "token-fake-inicial"
    else throwError err401 { errBody = "Usuário ou senha inválidos" }

pacientesHandler :: Handler [Paciente]
pacientesHandler =
  return
    [ Paciente "João da Silva" "00000000000"
    , Paciente "Maria Souza" "11111111111"
    ]

api :: Proxy API
api = Proxy

app :: Application
app = serve api server

main :: IO ()
main = do
  putStrLn "Hospital API iniciada em http://localhost:8080"
  run 8080 app