
import React, { useState, useEffect } from "react";
import { Clock, Users, ShoppingBag, Glasses, Calendar, ArrowRight, CircleDollarSign, Search } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patients } = usePatientStore();
  const { frames, lensTypes } = useInventoryStore();
  const { invoices, workOrders } = useInvoiceStore();
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStats = () => {
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingWorkOrders = workOrders.filter(wo => {
      // A work order is pending if it doesn't have a corresponding invoice
      // or if the invoice is not fully paid
      const invoice = invoices.find(inv => inv.workOrderId === wo.id);
      return !invoice || !invoice.isPaid;
    }).length;

    return {
      patients: patients.length,
      frames: frames.length,
      lensTypes: lensTypes.length,
      totalSales,
      pendingWorkOrders
    };
  };

  const stats = getStats();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="py-4 space-y-6"
    >
      {/* Hero Section */}
      <motion.div 
        variants={item}
        className="flex justify-between items-center bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-6 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-3xl font-bold text-primary">{t('welcome')}</h2>
            <LanguageToggle />
          </div>
          <p className="mt-2 text-gray-600">
            {t('systemDescription')}
          </p>
          <div className="mt-6 space-x-3 rtl:space-x-reverse">
            <Link to="/reports">
              <Button variant="default" className="shadow-md">
                {t('reportsPage')}
                <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <MoenLogoGreen className="w-auto h-32 mb-4" />
          <div className="flex items-center gap-3 bg-white/90 px-4 py-2 rounded-md shadow-sm border border-primary/10">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-gray-500">{t('currentTime')}</p>
              <p className="text-lg font-semibold force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {t('clients')}
              </CardTitle>
              <CardDescription>{t('registeredClients')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.patients}</p>
              <Link 
                to="/" 
                onClick={() => {}} 
                className="text-blue-500 text-sm flex items-center mt-2 hover:underline"
                state={{ section: "patientSearch" }}
              >
                {t('searchClients')}
                <ArrowRight className={`ml-1 h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Glasses className="h-5 w-5 text-amber-500" />
                {t('inventory')}
              </CardTitle>
              <CardDescription>{t('framesAndLenses')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t('frames')}</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.frames}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('lensTypes')}</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.lensTypes}</p>
                </div>
              </div>
              <Link 
                to="/" 
                onClick={() => {}} 
                className="text-amber-500 text-sm flex items-center mt-2 hover:underline"
                state={{ section: "inventory" }}
              >
                {t('manageInventory')}
                <ArrowRight className={`ml-1 h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-green-500" />
                {t('sales')}
              </CardTitle>
              <CardDescription>{t('totalSales')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.totalSales.toFixed(3)} {t('kwd')}</p>
              <Link 
                to="/" 
                onClick={() => {}} 
                className="text-green-500 text-sm flex items-center mt-2 hover:underline"
                state={{ section: "remainingPayments" }}
              >
                {t('manageInvoices')}
                <ArrowRight className={`ml-1 h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                {t('workOrders')}
              </CardTitle>
              <CardDescription>{t('pendingWorkOrders')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{stats.pendingWorkOrders}</p>
              <Link 
                to="/" 
                onClick={() => {}} 
                className="text-purple-500 text-sm flex items-center mt-2 hover:underline"
                state={{ section: "createInvoice" }}
              >
                {t('createNewWorkOrder')}
                <ArrowRight className={`ml-1 h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
            <CardDescription>{t('commonTasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link to="/" state={{ section: "createClient" }}>
                <Button variant="outline" className="w-full flex items-center justify-start h-12 text-blue-600">
                  <Users className="h-4 w-4 mr-2" />
                  {t('newClient')}
                </Button>
              </Link>
              <Link to="/" state={{ section: "createInvoice" }}>
                <Button variant="outline" className="w-full flex items-center justify-start h-12 text-green-600">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t('newSale')}
                </Button>
              </Link>
              <Link to="/" state={{ section: "patientSearch" }}>
                <Button variant="outline" className="w-full flex items-center justify-start h-12 text-amber-600">
                  <Search className="h-4 w-4 mr-2" />
                  {t('findClient')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
