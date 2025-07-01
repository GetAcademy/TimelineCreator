const model = {
    app: {
        activeTimelineId: null,  
        currentPage: null,
    },
    viewState: {
        main: {},
        edit: {},
        view: {},
    }, 
    timelines: [
        {
            id: 'tl1',
            title: 'Produktlansering Q4 2025',
            orientation: 'horizontal',
            trackColor: '#5B21B6',            // lilla spor
            textColor: '#1F2937',            // mørk grå tekst
            segments: [
                { id: 's1', label: 'Kick-off', position: 0, color: null },
                { id: 's2', label: 'Beta', position: 50, color: null },
                { id: 's3', label: 'Launch', position: 100, color: null }
            ]
        },

        {
            id: 'tl2',
            title: 'Studentprosjekt – høst 2025',
            orientation: 'vertical',
            trackColor: '#0EA5E9',            // blått spor
            textColor: '#0F172A',            // nesten svart
            segments: [
                { id: 's4', label: 'Idé', position: 0, color: '#0EA5E9' },
                { id: 's5', label: 'Prototype', position: 33, color: '#0EA5E9' },
                { id: 's6', label: 'MVP', position: 66, color: '#0EA5E9' },
                { id: 's7', label: 'Demo-dag', position: 100, color: '#0EA5E9' }
            ]
        },

        {
            id: 'tl3',
            title: 'Roadmap - Læringsløp JavaScript',
            orientation: 'horizontal',
            trackColor: '#15803D',            // grønt spor
            textColor: '#064E3B',
            segments: [
                { id: 's8', label: 'Grunn-syntax', position: 0 },
                { id: 's9', label: 'DOM-manip.', position: 25 },
                { id: 's10', label: 'Fetch API', position: 50 },
                { id: 's11', label: 'Modules', position: 75 },
                { id: 's12', label: 'TypeScript', position: 100 }
            ]
        }
    ]
};
