"use client"
import Box from "@mui/material/Box"

import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { useEffect, useState } from "react"
import { Formik, Form, Field } from "formik"
import TextInput from "@/components/common/TextInput"
import { AuthFooter, AuthHeader } from "@/components/common/AppLayout"
import { IMG } from "@/assets/images"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AppButton } from "@/components"
import { COLORS } from "@/theme/colors"
import MenuItem from "@mui/material/MenuItem"

const RmLoginScreen = () => {
  const { t } = useTranslation()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/public/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }
  }, [])

  const initialValues = {
    phoneNumber: "",
    email: "",
  }

  const handleSubmit = (values: any) => {
    console.log("Form Data:", values)
    navigate("/RmDashboard", {
      state: { email: values.email },
    })
  }

  return (
    <Box
      sx={{
        maxWidth: "1600px",
        width: "100%",
        margin: "auto",
        paddingX: { xs: "1rem", md: "1.125rem", lg: "2rem" },
      }}
    >
      <AuthHeader />
      <Grid
        container
        spacing={4}
        sx={{
          paddingY: 4,
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <img
            src={IMG.LoginImage || "/placeholder.svg"}
            alt="ADCB"
            loading="lazy"
            className="rounded-3xl max-w-full"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            className="!rounded-2xl shadow-sm h-full"
            style={{ backgroundColor: COLORS.WHITE_SECONDARY }}
          >
            <CardContent
              sx={{
                paddingY: { md: 6 },
                paddingX: { md: 4 },
              }}
            >
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ submitForm }) => (
                  <Form className="mb-10">
                    <Field name="email">
                      {({ field }: any) => (
                        <TextInput
                          {...field}
                          label={t("loginScreen.email") || "Email address"}
                          placeholder="Select your email address"
                          select
                          fullWidth
                          margin="normal"
                        >
                          <MenuItem value="HeenaRajwani.ext@adcb.com">HeenaRajwani.ext@adcb.com</MenuItem>
                          <MenuItem value="veeramani.sampath@adcb.com">veeramani.sampath@adcb.com</MenuItem>
                          <MenuItem value="shaileshsunil.ext@adcb.com">shaileshsunil.ext@adcb.com</MenuItem>
                        </TextInput>
                      )}
                    </Field>

                    <AppButton onClick={() => submitForm()} style={{ marginTop: "16px" }}>
                      {t("loginScreen.proceed") || "Proceed"}
                    </AppButton>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AuthFooter />
    </Box>
  )
}

export default RmLoginScreen
