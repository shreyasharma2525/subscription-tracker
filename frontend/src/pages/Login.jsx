import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCreditCard,
  FiBarChart2,
  FiShield,
  FiCalendar,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAppSettings } from "../context/AppSettingsContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useAppSettings();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pageBg = isDark
    ? "linear-gradient(135deg, #020617 0%, #0F172A 45%, #1E1B4B 100%)"
    : "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 45%, #F3E8FF 100%)";

  const cardBg = isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.88)";
  const textColor = isDark ? "#F8FAFC" : "#111827";
  const mutedText = isDark ? "#CBD5E1" : "#64748B";
  const inputBg = isDark ? "#111827" : "white";
  const borderColor = isDark ? "#334155" : "#E5E7EB";

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await login(formData.username, formData.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={pageBg}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 5, md: 8 }}
    >
      <Box
        position="absolute"
        top="-120px"
        left="-120px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="purple.500"
        opacity={0.22}
        filter="blur(30px)"
      />

      <Box
        position="absolute"
        bottom="-140px"
        right="-120px"
        w="360px"
        h="360px"
        borderRadius="full"
        bg="blue.500"
        opacity={0.18}
        filter="blur(35px)"
      />

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        maxW="1050px"
        w="100%"
        gap={8}
        alignItems="center"
        position="relative"
        zIndex={1}
      >
        <Box display={{ base: "none", lg: "block" }}>
          <HStack mb={6}>
            <Box
              w="56px"
              h="56px"
              borderRadius="2xl"
              bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="900"
              shadow="xl"
            >
              S
            </Box>

            <Box>
              <Heading color={textColor} size="lg">
                SubTracker
              </Heading>
              <Text color={mutedText}>Smart subscription manager</Text>
            </Box>
          </HStack>

          <Heading
            color={textColor}
            fontSize={{ base: "3xl", lg: "5xl" }}
            lineHeight="1.1"
            mb={5}
          >
            Manage every subscription in one beautiful dashboard.
          </Heading>

          <Text color={mutedText} fontSize="lg" maxW="520px" mb={8}>
            Track renewals, monthly spend, owners, categories, and reports —
            all protected with login-based user sessions.
          </Text>

          <SimpleGrid columns={2} gap={4} maxW="520px">
            <FeatureCard
              icon={<FiCreditCard />}
              title="Track Payments"
              text="Monitor costs and billing cycles."
              isDark={isDark}
            />

            <FeatureCard
              icon={<FiCalendar />}
              title="Renewal Alerts"
              text="See upcoming renewals easily."
              isDark={isDark}
            />

            <FeatureCard
              icon={<FiBarChart2 />}
              title="Reports"
              text="Visualize spending with charts."
              isDark={isDark}
            />

            <FeatureCard
              icon={<FiShield />}
              title="Secure Sessions"
              text="JWT-based login and logout."
              isDark={isDark}
            />
          </SimpleGrid>
        </Box>

        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          backdropFilter="blur(18px)"
          w="100%"
          maxW="450px"
          mx="auto"
          p={{ base: 6, md: 8 }}
          borderRadius="3xl"
          shadow="2xl"
        >
          <VStack align="stretch" gap={6}>
            <Box textAlign="center">
              <Box
                mx="auto"
                mb={4}
                w="64px"
                h="64px"
                borderRadius="2xl"
                bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xl"
                fontWeight="900"
                shadow="lg"
              >
                S
              </Box>

              <Badge colorPalette="purple" borderRadius="full" px={3} py={1}>
                Welcome to SubTracker
              </Badge>

              <Heading mt={4} color={textColor} size="lg">
                Welcome Back
              </Heading>

              <Text color={mutedText} mt={2}>
                Login to manage your subscriptions
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack align="stretch" gap={4}>
                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="600" color={textColor}>
                    Username
                  </Text>

                  <HStack
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    px={3}
                    h="48px"
                    _focusWithin={{
                      borderColor: "#8B5CF6",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.22)",
                    }}
                  >
                    <FiUser color={mutedText} />

                    <Input
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      border="none"
                      outline="none"
                      color={textColor}
                      _focus={{ boxShadow: "none" }}
                      _placeholder={{ color: mutedText }}
                      required
                    />
                  </HStack>
                </Box>

                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="600" color={textColor}>
                    Password
                  </Text>

                  <HStack
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    px={3}
                    h="48px"
                    _focusWithin={{
                      borderColor: "#8B5CF6",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.22)",
                    }}
                  >
                    <FiLock color={mutedText} />

                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      border="none"
                      outline="none"
                      color={textColor}
                      _focus={{ boxShadow: "none" }}
                      _placeholder={{ color: mutedText }}
                      required
                    />

                    <Box
                      as="button"
                      type="button"
                      color={mutedText}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </Box>
                  </HStack>
                </Box>

                <Button
                  type="submit"
                  size="lg"
                  colorPalette="purple"
                  bg="linear-gradient(135deg, #8B5CF6, #7C3AED)"
                  color="white"
                  loading={loading}
                  loadingText="Logging in..."
                  borderRadius="xl"
                  mt={2}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "xl",
                  }}
                >
                  Login
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color={mutedText}>
              New here?{" "}
              <Link
                to="/register"
                style={{
                  color: "#8B5CF6",
                  fontWeight: "700",
                }}
              >
                Create account
              </Link>
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

function FeatureCard({ icon, title, text, isDark }) {
  return (
    <Box
      bg={isDark ? "rgba(30, 41, 59, 0.72)" : "rgba(255, 255, 255, 0.72)"}
      border="1px solid"
      borderColor={isDark ? "#334155" : "#E5E7EB"}
      borderRadius="2xl"
      p={4}
      backdropFilter="blur(12px)"
    >
      <Box color="#8B5CF6" fontSize="24px" mb={3}>
        {icon}
      </Box>

      <Text fontWeight="700" color={isDark ? "#F8FAFC" : "#111827"}>
        {title}
      </Text>

      <Text fontSize="sm" color={isDark ? "#CBD5E1" : "#64748B"} mt={1}>
        {text}
      </Text>
    </Box>
  );
}

export default Login;