import { useEffect, useState } from "react";
import { Box, Heading, Text, Badge, VStack, HStack } from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";
import API from "../api/subscriptionApi";
import { useAppSettings } from "../context/AppSettingsContext";

const getDaysLeft = (date) => {
  const today = new Date();
  const renewalDate = new Date(date);

  const diffTime = renewalDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

function Renewals() {
  const {
    cardBg,
    textColor,
    mutedText,
    borderColor,
    softBg,
    formatCurrency,
  } = useAppSettings();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await API.get("/subscriptions/");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching renewals:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingRenewals = subscriptions
    .filter((subscription) => {
      const daysLeft = getDaysLeft(subscription.next_renewal_date);
      return subscription.is_active && daysLeft >= 0 && daysLeft <= 30;
    })
    .sort(
      (a, b) =>
        new Date(a.next_renewal_date) - new Date(b.next_renewal_date)
    );

  return (
    <>
      <Box mb={8}>
        <Heading size="xl" color={textColor}>
          Upcoming Renewals
        </Heading>

        <Text color={mutedText} mt={1}>
          Subscriptions renewing in the next 30 days.
        </Text>
      </Box>

      {loading ? (
        <Text color={mutedText}>Loading renewals...</Text>
      ) : upcomingRenewals.length === 0 ? (
        <Box
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <Text color={mutedText}>No upcoming renewals found.</Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={4}>
          {upcomingRenewals.map((subscription) => {
            const daysLeft = getDaysLeft(subscription.next_renewal_date);

            return (
              <Box
                key={subscription.id}
                bg={cardBg}
                p={6}
                borderRadius="2xl"
                shadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <HStack justify="space-between" wrap="wrap" gap={5}>
                  <HStack gap={4}>
                    <Box
                      w="48px"
                      h="48px"
                      borderRadius="xl"
                      bg={softBg}
                      color="purple.400"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="24px"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <FiCalendar />
                    </Box>

                    <Box>
                      <Heading size="md" color={textColor}>
                        {subscription.service_name}
                      </Heading>

                      <Text color={mutedText} fontSize="sm">
                        Owner: {subscription.owner_name}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack gap={8} wrap="wrap">
                    <Box>
                      <Text color={mutedText} fontSize="sm">
                        Renewal Date
                      </Text>
                      <Text color={textColor} fontWeight="bold">
                        {subscription.next_renewal_date}
                      </Text>
                    </Box>

                    <Box>
                      <Text color={mutedText} fontSize="sm">
                        Amount
                      </Text>
                      <Text color={textColor} fontWeight="bold">
                        {formatCurrency(subscription.cost)}
                      </Text>
                    </Box>

                    <Badge
                      colorPalette={daysLeft <= 7 ? "red" : "orange"}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {daysLeft === 0 ? "Today" : `${daysLeft} days left`}
                    </Badge>
                  </HStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </>
  );
}

export default Renewals;