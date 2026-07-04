import { Box, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiCalendar,
  FiPieChart,
} from "react-icons/fi";
import { useAppSettings } from "../../context/AppSettingsContext";

const getMonthlyCost = (subscription) => {
  const cost = Number(subscription.cost);

  if (subscription.billing_cycle === "weekly") return cost * 4;
  if (subscription.billing_cycle === "yearly") return cost / 12;

  return cost;
};

const isRenewingSoon = (date) => {
  const today = new Date();
  const renewalDate = new Date(date);

  const diffTime = renewalDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 30;
};

function StatsCards({ subscriptions }) {
  const { cardBg, textColor, mutedText, borderColor, formatCurrency } =
    useAppSettings();

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.is_active
  );

  const monthlySpend = activeSubscriptions.reduce(
    (total, subscription) => total + getMonthlyCost(subscription),
    0
  );

  const annualSpend = monthlySpend * 12;

  const renewingSoon = activeSubscriptions.filter((subscription) =>
    isRenewingSoon(subscription.next_renewal_date)
  ).length;

  const categories = new Set(
    subscriptions.map((subscription) => subscription.category)
  ).size;

  const stats = [
    {
      title: "Total Monthly Spend",
      value: formatCurrency(monthlySpend),
      helper: `Across ${subscriptions.length} subscriptions`,
      icon: FiTrendingUp,
      iconBg: "#F3E8FF",
      iconColor: "#7C3AED",
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions.length,
      helper: "Currently active",
      icon: FiCheckCircle,
      iconBg: "#DCFCE7",
      iconColor: "#16A34A",
    },
    {
      title: "Upcoming Renewals",
      value: renewingSoon,
      helper: "Next 30 days",
      icon: FiCalendar,
      iconBg: "#FFEDD5",
      iconColor: "#EA580C",
    },
    {
      title: "Annual Spend",
      value: formatCurrency(annualSpend),
      helper: `${categories} categories`,
      icon: FiPieChart,
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={6}>
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Box
            key={stat.title}
            bg={cardBg}
            p={6}
            borderRadius="2xl"
            shadow="md"
            border="1px solid"
            borderColor={borderColor}
          >
            <HStack justify="space-between" align="start">
              <Box>
                <Text color={mutedText} fontSize="sm">
                  {stat.title}
                </Text>

                <Heading mt={3} size="lg" color={textColor}>
                  {stat.value}
                </Heading>

                <Text mt={2} color={mutedText} fontSize="sm">
                  {stat.helper}
                </Text>
              </Box>

              <Box
                w="52px"
                h="52px"
                borderRadius="full"
                bg={stat.iconBg}
                color={stat.iconColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="24px"
              >
                <Icon />
              </Box>
            </HStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}

export default StatsCards;