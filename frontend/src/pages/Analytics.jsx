import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

import API from "../api/subscriptionApi";
import { useAppSettings } from "../context/AppSettingsContext";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
];

const getMonthlyCost = (subscription) => {
  const cost = Number(subscription.cost);

  if (subscription.billing_cycle === "weekly") return cost * 4;
  if (subscription.billing_cycle === "yearly") return cost / 12;

  return cost;
};

function Analytics() {
  const {
    cardBg,
    inputBg,
    textColor,
    mutedText,
    borderColor,
    formatCurrency,
    isDark,
  } = useAppSettings();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState("category");
  const [chartType, setChartType] = useState("bar");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const selectStyle = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: `1px solid ${borderColor}`,
    backgroundColor: inputBg,
    color: textColor,
    minWidth: "180px",
    outline: "none",
  };

  const optionStyle = {
    backgroundColor: inputBg,
    color: textColor,
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await API.get("/subscriptions/");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const owners = useMemo(() => {
    return [
      "all",
      ...new Set(subscriptions.map((subscription) => subscription.owner_name)),
    ];
  }, [subscriptions]);

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(subscriptions.map((subscription) => subscription.category)),
    ];
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const ownerMatch =
        selectedOwner === "all" || subscription.owner_name === selectedOwner;

      const categoryMatch =
        selectedCategory === "all" ||
        subscription.category === selectedCategory;

      return ownerMatch && categoryMatch;
    });
  }, [subscriptions, selectedOwner, selectedCategory]);

  const chartData = useMemo(() => {
    if (reportType === "category") {
      const grouped = {};

      filteredSubscriptions.forEach((subscription) => {
        const key = subscription.category;
        grouped[key] = (grouped[key] || 0) + getMonthlyCost(subscription);
      });

      return Object.entries(grouped).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));
    }

    if (reportType === "owner") {
      const grouped = {};

      filteredSubscriptions.forEach((subscription) => {
        const key = subscription.owner_name;
        grouped[key] = (grouped[key] || 0) + getMonthlyCost(subscription);
      });

      return Object.entries(grouped).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));
    }

    if (reportType === "billing") {
      const grouped = {};

      filteredSubscriptions.forEach((subscription) => {
        const key = subscription.billing_cycle;
        grouped[key] = (grouped[key] || 0) + 1;
      });

      return Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));
    }

    if (reportType === "renewals") {
      return filteredSubscriptions
        .map((subscription) => ({
          name: subscription.next_renewal_date,
          value: Number(subscription.cost),
          service: subscription.service_name,
        }))
        .sort((a, b) => new Date(a.name) - new Date(b.name));
    }

    return [];
  }, [filteredSubscriptions, reportType]);

  const totalMonthlySpend = filteredSubscriptions.reduce(
    (total, subscription) => total + getMonthlyCost(subscription),
    0
  );

  const activeCount = filteredSubscriptions.filter(
    (subscription) => subscription.is_active
  ).length;

  const highestItem = chartData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { name: "-", value: 0 }
  );

  const reportTitle = {
    category: "Monthly spend by category",
    owner: "Monthly spend by owner",
    billing: "Subscriptions by billing cycle",
    renewals: "Renewal amount by date",
  };

  const valueLabel = reportType === "billing" ? "Subscriptions" : "Amount";

  const tooltipStyle = {
    backgroundColor: isDark ? "#111827" : "white",
    border: `1px solid ${borderColor}`,
    color: textColor,
    borderRadius: "10px",
  };

  const axisColor = isDark ? "#CBD5E1" : "#64748B";
  const gridColor = isDark ? "#334155" : "#E5E7EB";

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <Box
          h="360px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color={mutedText}>No data available for selected filters.</Text>
        </Box>
      );
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) =>
                reportType === "billing" ? value : formatCurrency(value)
              }
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) =>
                reportType === "billing" ? value : formatCurrency(value)
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) =>
              reportType === "billing" ? value : formatCurrency(value)
            }
          />
          <Legend />
          <Bar
            dataKey="value"
            name={valueLabel}
            fill="#8B5CF6"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <HStack justify="space-between" mb={8} wrap="wrap">
        <Box>
          <Heading size="xl" color={textColor}>
            Analytics & Reports
          </Heading>

          <Text color={mutedText} mt={1}>
            Visualize your spending, renewals, owners, and categories.
          </Text>
        </Box>

        <Badge colorPalette="purple" borderRadius="full" px={4} py={2}>
          Live data from Django API
        </Badge>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <Text color={mutedText} fontSize="sm">
            Filtered Monthly Spend
          </Text>
          <Heading mt={2} size="lg" color="purple.400">
            {formatCurrency(totalMonthlySpend)}
          </Heading>
        </Box>

        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <Text color={mutedText} fontSize="sm">
            Active Subscriptions
          </Text>
          <Heading mt={2} size="lg" color="green.400">
            {activeCount}
          </Heading>
        </Box>

        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <Text color={mutedText} fontSize="sm">
            Highest Item
          </Text>
          <Heading mt={2} size="md" color="orange.400">
            {highestItem.name}
          </Heading>
          <Text color={mutedText} fontSize="sm">
            {reportType === "billing"
              ? highestItem.value
              : formatCurrency(highestItem.value)}
          </Text>
        </Box>
      </SimpleGrid>

      <Box
        bg={cardBg}
        p={5}
        borderRadius="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        mb={8}
      >
        <HStack gap={4} wrap="wrap">
          <Box>
            <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
              Report Type
            </Text>
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              style={selectStyle}
            >
              <option value="category" style={optionStyle}>
                Spend by Category
              </option>
              <option value="owner" style={optionStyle}>
                Spend by Owner
              </option>
              <option value="billing" style={optionStyle}>
                Billing Cycle Count
              </option>
              <option value="renewals" style={optionStyle}>
                Renewals by Date
              </option>
            </select>
          </Box>

          <Box>
            <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
              Chart Type
            </Text>
            <select
              value={chartType}
              onChange={(event) => setChartType(event.target.value)}
              style={selectStyle}
            >
              <option value="bar" style={optionStyle}>
                Bar Chart
              </option>
              <option value="pie" style={optionStyle}>
                Pie Chart
              </option>
              <option value="line" style={optionStyle}>
                Line Chart
              </option>
            </select>
          </Box>

          <Box>
            <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
              Owner
            </Text>
            <select
              value={selectedOwner}
              onChange={(event) => setSelectedOwner(event.target.value)}
              style={selectStyle}
            >
              {owners.map((owner) => (
                <option key={owner} value={owner} style={optionStyle}>
                  {owner === "all" ? "All Owners" : owner}
                </option>
              ))}
            </select>
          </Box>

          <Box>
            <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
              Category
            </Text>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              style={selectStyle}
            >
              {categories.map((category) => (
                <option key={category} value={category} style={optionStyle}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </Box>
        </HStack>
      </Box>

      <Box
        bg={cardBg}
        p={6}
        borderRadius="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <HStack justify="space-between" mb={6} wrap="wrap">
          <Box>
            <Heading size="md" color={textColor}>
              {reportTitle[reportType]}
            </Heading>

            <Text color={mutedText} fontSize="sm">
              Choose report type, chart type, owner, and category to change the data.
            </Text>
          </Box>

          <Badge colorPalette="blue" borderRadius="full" px={3} py={1}>
            {filteredSubscriptions.length} records
          </Badge>
        </HStack>

        {loading ? <Text color={mutedText}>Loading chart...</Text> : renderChart()}
      </Box>
    </>
  );
}

export default Analytics;