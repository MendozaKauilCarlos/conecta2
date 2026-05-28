
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserData, Dependency } from '../../types';
import { Sidebar } from './Sidebar';
import { ProfileView } from './ProfileView';
import { CatalogView } from './CatalogView';
import { DocumentsView } from './DocumentsView';
import { AdminCatalogView } from './AdminCatalogView';
import { AdminReviewsView } from './AdminReviewsView';
import * as dbService from '../../services/dbService';

export function Dashboard({ 
  user, 
  onLogout, 
  isDarkMode, 
  onToggleDarkMode,
  onUpdateProfile
}: { 
  user: UserData, 
  onLogout: () => void, 
  isDarkMode: boolean, 
  onToggleDarkMode: () => void,
  onUpdateProfile?: (u: UserData) => void
}) {
  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'AdminCatalog' : 'Profile');
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null);
  const [dataConfirmed, setDataConfirmed] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user.role === 'student' && user.id_dependencia && !selectedDependency) {
      dbService.getDependencies().then(deps => {
        const found = deps.find(d => d.id === user.id_dependencia);
        if (found) {
          setSelectedDependency(found);
        } else {
          // Minimal fallback so that navigation functions and they can view documents
          setSelectedDependency({
            id: user.id_dependencia!,
            name: user.dependencia_seleccionada || 'Dependencia Seleccionada',
            category: 'General',
            subCategory: 'Residencias',
            location: 'Cancún',
            vacancies: 0,
            maxVacancies: 5,
            status: 'Lugares Limitados',
            image: ''
          });
        }
      }).catch(err => {
        console.error("Error pre-loading chosen dependency details: ", err);
        // Fallback minimal object
        setSelectedDependency({
          id: user.id_dependencia!,
          name: user.dependencia_seleccionada || 'Dependencia Seleccionada',
          category: 'General',
          subCategory: 'Residencias',
          location: 'Cancún',
          vacancies: 0,
          maxVacancies: 5,
          status: 'Lugares Limitados',
          image: ''
        });
      });
    }
  }, [user.id_dependencia]);

  const handleSelectDependency = (dep: Dependency) => {
    setSelectedDependency(dep);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...user,
        id_dependencia: dep.id,
        dependencia_seleccionada: dep.name
      });
    }
    setActiveTab('Docs');
  };

  const renderContent = () => {
    if (user.role === 'admin') {
      switch (activeTab) {
        case 'AdminCatalog':
          return <AdminCatalogView isDarkMode={isDarkMode} />;
        case 'AdminReviews':
          return <AdminReviewsView isDarkMode={isDarkMode} />;
        default:
          return <AdminCatalogView isDarkMode={isDarkMode} />;
      }
    }

    switch (activeTab) {
      case 'Profile':
        return (
          <ProfileView 
            user={user} 
            onUpdateProfile={onUpdateProfile}
            onConfirmData={() => {
              setDataConfirmed(true);
              setActiveTab('Catalog');
            }} 
            isDarkMode={isDarkMode} 
          />
        );
      case 'Catalog':
        return <CatalogView user={user} onSelectDependency={handleSelectDependency} isDarkMode={isDarkMode} />;
      case 'Docs':
        return <DocumentsView user={user} isDarkMode={isDarkMode} />;
      default:
        return <ProfileView user={user} onConfirmData={() => setDataConfirmed(true)} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-neutral-50'}`}>
      <Sidebar 
        user={user}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        dataConfirmed={dataConfirmed}
        selectedDependency={selectedDependency}
      />

      <main className="flex-1 p-6 sm:p-10 lg:p-16 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
