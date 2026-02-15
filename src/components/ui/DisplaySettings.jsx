import React from 'react';
import SettingToggle from './SettingToggle'; // Import SettingToggle

const SettingSlider = ({ label, id, min, max, step, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
            id={id}
            type="range"
            min={min} max={max} step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
        />
    </div>
);

const DisplaySettings = ({ isOpen, settings, updateSettings, onReset }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-20 border dark:border-slate-700">
            <div className="space-y-4">
                <SettingSlider
                    label="Ukuran Teks Arab"
                    id="arabic-font-slider"
                    min="1.25" max="3" step="0.125"
                    value={settings.arabicSize}
                    onChange={(e) => updateSettings({ arabicSize: parseFloat(e.target.value) })}
                />
                <SettingSlider
                    label="Ukuran Teks Terjemahan"
                    id="tooltip-font-slider"
                    min="0.6" max="1.25" step="0.0625"
                    value={settings.tooltipSize}
                    onChange={(e) => updateSettings({ tooltipSize: parseFloat(e.target.value) })}
                />
                <SettingSlider
                    label="Jarak Antar Kata"
                    id="word-spacing-slider"
                    min="0" max="1" step="0.05"
                    value={settings.wordSpacing}
                    onChange={(e) => updateSettings({ wordSpacing: parseFloat(e.target.value) })}
                />
                <SettingSlider
                    label="Jarak Antar Baris"
                    id="line-height-slider"
                    min="1.5" max="4.5" step="0.05"
                    value={settings.lineHeight}
                    onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                />
                <SettingSlider
                    label="Ukuran Teks I'rab"
                    id="irab-font-slider"
                    min="0.75" max="2" step="0.0625"
                    value={settings.irabSize}
                    onChange={(e) => updateSettings({ irabSize: parseFloat(e.target.value) })}
                />
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <SettingToggle
                        label="Efek Suara"
                        id="sound-enabled-toggle"
                        isChecked={settings.isSoundEnabled}
                        onChange={(e) => updateSettings({ isSoundEnabled: e.target.checked })}
                    />
                    <SettingToggle
                        label="Mode Fokus"
                        id="focus-mode-toggle"
                        isChecked={settings.isFocusMode}
                        onChange={(e) => updateSettings({ isFocusMode: e.target.checked })}
                    />
                    <SettingToggle
                        label="Gunakan Kode Warna Nga-logat"
                        id="use-ngalogat-color-coding-toggle"
                        isChecked={settings.useNgaLogatColorCoding}
                        onChange={(e) => updateSettings({ useNgaLogatColorCoding: e.target.checked })}
                    />
                    <div className="my-4 border-t border-gray-300 dark:border-gray-600"></div>
                    <SettingToggle
                        label="Tampilkan Semua Harakat"
                        id="show-all-harakat-toggle"
                        isChecked={settings.showAllHarakat}
                        onChange={(e) => updateSettings({ showAllHarakat: e.target.checked })}
                    />
                    <SettingToggle
                        label="Tampilkan Semua Terjemah"
                        id="show-all-translations-toggle"
                        isChecked={settings.showAllTranslations}
                        onChange={(e) => updateSettings({ showAllTranslations: e.target.checked })}
                    />
                    <SettingToggle
                        label="Tampilkan Semua Nga-logat"
                        id="show-all-ngalogat-toggle"
                        isChecked={settings.showAllNgaLogat}
                        onChange={(e) => updateSettings({ showAllNgaLogat: e.target.checked })}
                    />
                </div>            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <button onClick={onReset} className="w-full text-sm bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded">
                        Reset ke Default
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisplaySettings;
