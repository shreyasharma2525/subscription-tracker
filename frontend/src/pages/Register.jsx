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
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiCreditCard,
  FiCalendar,
  FiBarChart2,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAppSettings } from "../context/AppSettingsContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark } = useAppSettings();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pageBg = isDark
    ? "linear-gradient(135deg, #020617 0%, #0F172A 45%, #1E1B4B 100%)"
    : "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 45%, #F3E8FF 100%)";

  const cardBg = isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)";
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
  
      const response = await register(formData);
  
      console.log("Registration success:", response);
  
      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed full error:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
  
      const data = error.response?.data;
  
      if (!error.response) {
        alert(
          "Backend is not responding. Please check if Django server is running on port 8002."
        );
        return;
      }
  
      alert(
        data?.username?.[0] ||
          data?.email?.[0] ||
          data?.password?.[0] ||
          data?.detail ||
          JSON.stringify(data) ||
          "Registration failed."
      );
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
      <style>
        {`
          @keyframes floatUpDown {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-14px); }
            100% { transform: translateY(0px); }
          }

          @keyframes slowSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeSlideIn {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0px); }
          }

          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 rgba(139, 92, 246, 0.2); }
            50% { box-shadow: 0 0 35px rgba(139, 92, 246, 0.45); }
            100% { box-shadow: 0 0 0 rgba(139, 92, 246, 0.2); }
          }
        `}
      </style>

      <Box
        position="absolute"
        top="-120px"
        left="-120px"
        w="340px"
        h="340px"
        borderRadius="full"
        bg="purple.500"
        opacity={0.2}
        filter="blur(35px)"
        animation="floatUpDown 7s ease-in-out infinite"
      />

      <Box
        position="absolute"
        bottom="-150px"
        right="-120px"
        w="380px"
        h="380px"
        borderRadius="full"
        bg="blue.500"
        opacity={0.18}
        filter="blur(35px)"
        animation="floatUpDown 8s ease-in-out infinite"
      />

      <Box
        position="absolute"
        top="18%"
        right="16%"
        w="90px"
        h="90px"
        borderRadius="3xl"
        border="1px solid"
        borderColor={isDark ? "whiteAlpha.200" : "purple.100"}
        bg={isDark ? "whiteAlpha.100" : "whiteAlpha.700"}
        backdropFilter="blur(14px)"
        animation="slowSpin 18s linear infinite"
        display={{ base: "none", lg: "block" }}
      />

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        maxW="1100px"
        w="100%"
        gap={10}
        alignItems="center"
        position="relative"
        zIndex={1}
      >
        <Box
          display={{ base: "none", lg: "block" }}
          animation="fadeSlideIn 0.8s ease forwards"
        >
          <HStack mb={6}>
            <Box
              w="58px"
              h="58px"
              borderRadius="2xl"
              bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="900"
              shadow="xl"
              animation="pulseGlow 3s ease-in-out infinite"
            >
              S
            </Box>

            <Box>
              <Heading color={textColor} size="lg">
                SubTracker
              </Heading>
              <Text color={mutedText}>Your personal subscription command center</Text>
            </Box>
          </HStack>

          <Badge colorPalette="purple" borderRadius="full" px={4} py={2} mb={5}>
            First time here? Start fresh ✨
          </Badge>

          <Heading
            color={textColor}
            fontSize={{ base: "3xl", lg: "5xl" }}
            lineHeight="1.08"
            mb={5}
          >
            Create your private dashboard and take control of recurring payments.
          </Heading>

          <Text color={mutedText} fontSize="lg" maxW="560px" mb={8}>
            Add your subscriptions, track renewal dates, analyze spending, and
            manage everything from one secure account.
          </Text>

          <VStack align="stretch" gap={4} maxW="560px">
            <StepItem
              number="01"
              title="Create your secure account"
              text="Your subscriptions stay linked only to your login."
              isDark={isDark}
            />

            <StepItem
              number="02"
              title="Add your subscriptions"
              text="Track owners, renewal dates, billing cycles, and notes."
              isDark={isDark}
            />

            <StepItem
              number="03"
              title="Understand your spending"
              text="Use dashboard stats and reports to see where money goes."
              isDark={isDark}
            />
          </VStack>
        </Box>

        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          backdropFilter="blur(18px)"
          w="100%"
          maxW="470px"
          mx="auto"
          p={{ base: 6, md: 8 }}
          borderRadius="3xl"
          shadow="2xl"
          animation="fadeSlideIn 0.7s ease forwards"
        >
          <VStack align="stretch" gap={6}>
            <Box textAlign="center">
              <Box
                mx="auto"
                mb={4}
                w="66px"
                h="66px"
                borderRadius="2xl"
                bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xl"
                fontWeight="900"
                shadow="lg"
                animation="pulseGlow 3s ease-in-out infinite"
              >
                S
              </Box>

              <Badge colorPalette="purple" borderRadius="full" px={3} py={1}>
                Join SubTracker
              </Badge>

              <Heading mt={4} color={textColor} size="lg">
                Create Account
              </Heading>

              <Text color={mutedText} mt={2}>
                Start tracking your subscriptions today
              </Text>
            </Box>

            <SimpleGrid columns={2} gap={3}>
              <MiniBenefit icon={<FiShield />} text="Secure login" isDark={isDark} />
              <MiniBenefit icon={<FiBarChart2 />} text="Smart reports" isDark={isDark} />
              <MiniBenefit icon={<FiCalendar />} text="Renewal view" isDark={isDark} />
              <MiniBenefit icon={<FiCreditCard />} text="Spend tracking" isDark={isDark} />
            </SimpleGrid>

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
                      placeholder="Choose a username"
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
                    Email
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
                    <FiMail color={mutedText} />

                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
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
                      placeholder="Create a password"
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
                  loadingText="Creating account..."
                  borderRadius="xl"
                  mt={2}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "xl",
                  }}
                >
                  <HStack>
                    <Text>Create My Dashboard</Text>
                    <FiArrowRight />
                  </HStack>
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color={mutedText}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#8B5CF6",
                  fontWeight: "700",
                }}
              >
                Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

function StepItem({ number, title, text, isDark }) {
  return (
    <HStack
      bg={isDark ? "rgba(30, 41, 59, 0.72)" : "rgba(255, 255, 255, 0.72)"}
      border="1px solid"
      borderColor={isDark ? "#334155" : "#E5E7EB"}
      borderRadius="2xl"
      p={4}
      backdropFilter="blur(12px)"
      gap={4}
      animation="floatUpDown 6s ease-in-out infinite"
    >
      <Box
        w="42px"
        h="42px"
        borderRadius="xl"
        bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="800"
        flexShrink={0}
      >
        {number}
      </Box>

      <Box>
        <Text fontWeight="700" color={isDark ? "#F8FAFC" : "#111827"}>
          {title}
        </Text>
        <Text fontSize="sm" color={isDark ? "#CBD5E1" : "#64748B"}>
          {text}
        </Text>
      </Box>
    </HStack>
  );
}

function MiniBenefit({ icon, text, isDark }) {
  return (
    <HStack
      bg={isDark ? "rgba(30, 41, 59, 0.72)" : "#F8FAFC"}
      border="1px solid"
      borderColor={isDark ? "#334155" : "#E5E7EB"}
      borderRadius="xl"
      p={3}
      gap={2}
    >
      <Box color="#8B5CF6">{icon}</Box>
      <Text fontSize="sm" fontWeight="600" color={isDark ? "#F8FAFC" : "#111827"}>
        {text}
      </Text>
    </HStack>
  );
}

export default Register;