const threatIntelligence = require('./threatIntelligence');
const Threat = require('../models/Threat');

// Real-time Stats Container
let stats = {
    totalThreats: 0,
    activeThreats: 0,
    blockedAttacks: 0,
    systemHealth: 98,
    criticalAlerts: 0,
    typeDistribution: {},
    topSources: {},
    attacksBySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
    history: Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, attacks: 0, blocked: 0 }))
};

const socketManager = (io) => {
    // Initialize Threat Intelligence Service
    threatIntelligence.initialize().then(async () => {
        const historicStats = await threatIntelligence.getHistoricStats();

        if (historicStats) {
            console.log('SocketManager: Loaded historic stats from DB.');
            stats.totalThreats = historicStats.totalThreats;
            stats.topSources = historicStats.topSources || {};
            stats.attacksBySeverity = historicStats.attacksBySeverity || stats.attacksBySeverity;
            stats.criticalAlerts = stats.attacksBySeverity.critical;

            const types = ['DDoS', 'Malware', 'Phishing', 'Brute Force'];
            types.forEach(type => {
                stats.typeDistribution[type] = Math.floor(stats.totalThreats / types.length);
            });
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);
        socket.emit('dashboard_stats', stats);

        socket.on('disconnect', () => console.log('Client disconnected'));
    });

    // Real-Time Attack Generator
    setInterval(async () => {
        try {
            const event = await threatIntelligence.generateSimulatedEvent();

            const frontendEvent = {
                id: event.id,
                sourceCountry: event.sourceCountry,
                destinationCountry: event.destinationCountry,
                attackType: event.attackType,
                timestamp: event.timestamp,
                ipFrom: event.sourceIP,
                ipTo: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                severity: event.severity,
                dataSource: event.dataSource,
                details: {
                    mitre: event.mitreTactic,
                    dataSource: event.dataSource
                }
            };

            updateStats(frontendEvent);

            const threatDoc = new Threat({
                sourceCountry: frontendEvent.sourceCountry,
                destinationCountry: frontendEvent.destinationCountry,
                attackType: frontendEvent.attackType,
                timestamp: frontendEvent.timestamp,
                ipFrom: frontendEvent.ipFrom,
                ipTo: frontendEvent.ipTo,
                severity: frontendEvent.severity,
                details: frontendEvent.details
            });

            threatDoc.save()
                .then(async () => {
                    console.log(`Threat saved: ${frontendEvent.sourceCountry} -> ${frontendEvent.destinationCountry}`);

                    try {
                        const count = await Threat.countDocuments();
                        if (count > 2000) {
                            const cutoff = await Threat.find()
                                .sort({ timestamp: -1 })
                                .skip(1999)
                                .limit(1)
                                .select('timestamp');

                            if (cutoff && cutoff.length > 0) {
                                await Threat.deleteMany({ timestamp: { $lt: cutoff[0].timestamp } });
                            }
                        }
                    } catch (err) {
                        console.error('Limit Enforcement Error:', err);
                    }
                })
                .catch(e => console.error('Sim Save Error:', e));

            io.emit('attack_event', frontendEvent);
            io.emit('dashboard_stats', stats);

        } catch (error) {
            console.error('Socket Loop Error:', error.message);
        }
    }, 6000);

    // Re-sync stats with DB every 10 minutes
    setInterval(async () => {
        const historicStats = await threatIntelligence.getHistoricStats();
        if (historicStats) {
            console.log(`[SocketManager] Syncing stats with DB. Top Sources count: ${Object.keys(historicStats.topSources).length}`);
            stats.totalThreats = historicStats.totalThreats;
            stats.topSources = historicStats.topSources || {};
            stats.attacksBySeverity = historicStats.attacksBySeverity || stats.attacksBySeverity;
            stats.criticalAlerts = stats.attacksBySeverity.critical;
            io.emit('dashboard_stats', stats);
        }
    }, 10 * 60 * 1000);
};

function updateStats(attack) {
    stats.totalThreats++;
    stats.activeThreats = Math.floor(Math.random() * 50) + 10;

    if (Math.random() > 0.6) stats.blockedAttacks++;

    const type = attack.attackType || 'Unknown';
    if (!stats.typeDistribution[type]) stats.typeDistribution[type] = 0;
    stats.typeDistribution[type]++;

    const country = attack.sourceCountry || 'Unknown';
    if (!stats.topSources[country]) stats.topSources[country] = 0;
    stats.topSources[country]++;

    const s = attack.severity;
    if (s >= 9) {
        stats.attacksBySeverity.critical = (stats.attacksBySeverity.critical || 0) + 1;
        stats.criticalAlerts++;
    } else if (s >= 7) {
        stats.attacksBySeverity.high = (stats.attacksBySeverity.high || 0) + 1;
    } else if (s >= 4) {
        stats.attacksBySeverity.medium = (stats.attacksBySeverity.medium || 0) + 1;
    } else {
        stats.attacksBySeverity.low = (stats.attacksBySeverity.low || 0) + 1;
    }

    const currentHour = new Date().getHours();
    const idx = stats.history.findIndex(h => h.hour.startsWith(currentHour.toString()));
    if (idx !== -1) {
        stats.history[idx].attacks++;
    } else {
        stats.history[stats.history.length - 1].attacks++;
    }
}

socketManager.getThreats = () => [];

socketManager.getConnectionCount = (io) => {
    return io.engine.clientsCount;
};

module.exports = socketManager;
